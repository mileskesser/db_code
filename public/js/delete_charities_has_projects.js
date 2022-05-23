
function deleteCharities_has_projects(CharityID) {
    let link = '/delete-charities_has_projects-ajax/';
    let data = {
      Charities_charity_id: CharityID
    };
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8", 
      success: function(result) {
        deleteRow(CharityID);
      }
    });
  }
  
  function deleteRow(CharityID){
  
      let table = document.getElementById("charities-has-projects-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == CharityID) {
              table.deleteRow(i);
              break;
         }
      }
  }
  