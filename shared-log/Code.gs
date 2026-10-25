/**
 * Ceryllian Duel: shared playtest log.
 *
 * A Google Apps Script web app that stores every finished fight in a Google Sheet,
 * so everyone playing the GitHub build logs to one place. See the README for the
 * five-minute setup. The first request creates the sheet ("Ceryllian Duel playtest
 * log") in the Google Drive of whoever deployed the script.
 *
 * POST  {fights:[...]}   appends fights (the game sends one at a time)
 * GET                    returns {fights:[...]}, the most recent 1,000
 * GET   ?sheet=1         returns the sheet's URL, so you can find it
 */

var TAB = 'fights';
var MAX_FIGHTS_RETURNED = 1000;
var MAX_RECORD_CHARS = 45000; // a Sheets cell holds 50,000 characters

function getSheet_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('SHEET_ID');
  var ss = null;
  if (id) {
    try { ss = SpreadsheetApp.openById(id); } catch (err) { ss = null; }
  }
  if (!ss) {
    ss = SpreadsheetApp.create('Ceryllian Duel playtest log');
    props.setProperty('SHEET_ID', ss.getId());
  }
  var sh = ss.getSheetByName(TAB);
  if (!sh) {
    sh = ss.insertSheet(TAB);
    sh.appendRow(['received', 'player', 'rules version', 'result', 'rounds', 'level', 'insight',
                  'his wounds', 'cards in hand', 'cards lost', 'cards recovered', 'his cards turned', 'record']);
    sh.setFrozenRows(1);
    var first = ss.getSheets()[0];
    if (first.getName() !== TAB && first.getLastRow() === 0) ss.deleteSheet(first);
  }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    var fights = Array.isArray(body.fights) ? body.fights : [body];
    var sh = getSheet_();
    var added = 0;
    fights.slice(0, 200).forEach(function (f) {
      if (!f || typeof f !== 'object' || !f.result) return;
      var record = JSON.stringify(f);
      if (record.length > MAX_RECORD_CHARS) return;
      var st = f.settings || {};
      sh.appendRow([
        new Date(),
        String(f.player || 'anonymous').slice(0, 40),
        f.v || '',
        f.result,
        f.rounds || '',
        st.level || '',
        st.insight || 0,
        f.lampWounds || 0,
        f.hand || 0,
        (f.lost || []).length,
        f.recovered || 0,
        f.turned || 0,
        record
      ]);
      added++;
    });
    return json_({ok: true, added: added});
  } catch (err) {
    return json_({ok: false, error: String(err)});
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  var sh = getSheet_();
  if (e && e.parameter && e.parameter.sheet) return json_({sheet: sh.getParent().getUrl()});
  var last = sh.getLastRow();
  var n = Math.min(Math.max(last - 1, 0), MAX_FIGHTS_RETURNED);
  var cells = n > 0 ? sh.getRange(last - n + 1, 13, n, 1).getValues() : [];
  var fights = [];
  cells.forEach(function (row) {
    try { fights.push(JSON.parse(row[0])); } catch (err) { /* skip a damaged row */ }
  });
  return json_({fights: fights});
}
