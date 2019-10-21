var config = {
  apiKey: "AIzaSyCjos6Pn2aqXl4aw7wlVJPMPHuSD-PNbPI",
  authDomain: "cr-swing-dance.firebaseapp.com",
  databaseURL: "https://cr-swing-dance.firebaseio.com",
  storageBucket: "cr-swing-dance.appspot.com"
};
firebase.initializeApp(config);
var db = firebase.database();
var auth = firebase.auth();
var cbid;
var bidder;
var item;
var k; // Represents the minimum bid increase over the previous bid

window.onload = load;

async function load() {
  await auth.signInAnonymously().catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.error(errorCode + ': ' + errorMessage);
  });
  item = document.getElementById("tag").innerHTML;
  await loadCBid();
  document.getElementById("cbid").innerHTML = cbid;
  await db.ref(item).child('minbid').once('value', function (data) {
    k = data.node_.value_;
    k = parseFloat(k, 10);
  });
}

async function loadCBid() {
  await db.ref(item).child('num').once('value', function (data) {
    bidder = data.node_.value_;
    bidder = parseInt(bidder, 10);
  });
  await db.ref(item).child('bid'+bidder).once('value', function (data) {
    cbid = data.node_.value_;
    cbid = parseFloat(cbid, 10);
  });
}

async function bid() {
  message("");
  var name = document.getElementById("name").value;
  var bid = document.getElementById("bid").value;
  await loadCBid();
  if (name == "") {
    message("Please enter your name");
    return;
  }
  if (bid == "") {
    message("Please enter a bid");
    return;
  }
  if (bid >= cbid + k) {
    if (!confirm("Please confirm that $"+bid+" is the amount that you wish to bid.")) { // TODO check if this works
      return;
    }
    bidder++;
    db.ref(item).child('num').set(parseInt(bidder));
    db.ref(item).child('name'+bidder).set(name);
    db.ref(item).child('bid'+bidder).set(parseFloat(bid));
    message("Your bid has been submitted. Refresh the page to see it updated.")
  } else {
    message("Please enter a bid higher than the current one!<br>NOTE: You may need to refresh the page to see the current bid.");
  }
}

function message(reason) {
  alert(reason);
}