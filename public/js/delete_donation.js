
function deleteDonation(donationID) {
  let link = '/delete-donation-ajax/';
  let data = {
    donation_id: donationID
  };
  $.ajax({
    url: link,
    type: 'DELETE',
    data: JSON.stringify(data),
    contentType: "application/json; charset=utf-8", 
    success: function(result) {
      deleteRow(donationID);
    }
  });
}

function deleteRow(donationID){

    let table = document.getElementById("donations-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == donationID) {
            table.deleteRow(i);
            break;
       }
    }
}
