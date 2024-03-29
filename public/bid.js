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
  var name = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var bid = document.getElementById("bid").value;
  await loadCBid();
  if (name == "") {
    alert("Please enter your name. This is how we will identify the winner.");
    return;
  }
  if (email == "") {
    alert("Please enter your email. This is our primary way to contact you if you win.");
    return;
  }
  if (bid == "") {
    alert("Please enter a valid bid");
    return;
  }
  try {
    bid = parseFloat(bid);
  } catch (err) {
    alert("Please enter a valid bid");
    return;
  }
  if (bid >= cbid + k) {
    if (!confirm("Please confirm that $"+bid+" is the amount that you wish to bid.")) {
      return;
    }
    bidder++;
    db.ref(item).child('num').set(parseInt(bidder));
    db.ref(item).child('name'+bidder).set(name);
    db.ref(item).child('email'+bidder).set(email);
    db.ref(item).child('bid'+bidder).set(parseFloat(bid));
    alert("Your bid has been submitted.")
    window.location.reload(true);
  } else {
    alert("Please enter a bid higher than the current one!\nNOTE: You may need to refresh the page to see the current bid.");
  }
}