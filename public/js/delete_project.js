
function deleteProject(projectID) {
    let link = '/delete-project-ajax/';
    let data = {
      project_id: projectID
    };
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8", 
      success: function(result) {
        deleteRow(projectID);
      }
    });
  }
  
  function deleteRow(projectID){
  
      let table = document.getElementById("projects-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == projectID) {
              table.deleteRow(i);
              break;
         }
      }
  }
  