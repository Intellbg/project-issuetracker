'use strict';
// assigned_to and status_text.
projects=[]
REQUIERE_FIELDS=["issue_title", "issue_text", "created_by"]
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
    })
    
    .post(function (req, res){
      let project = req.params.project;
      if(! REQUIERE_FIELDS.every(attribute => req.body.hasOwnProperty(attribute))){
        return res.code(401).json({error:'required field(s) missing'})
      }
      project={
        issue_title:req.body.get("issue_title"),
        issue_text:req.body.get("issue_text"),
        created_by:req.body.get("created_by"),
        created_on:new Date().getTime(),
        updated_on:new Date().getTime(),
        assigned_to:req.body.get("assigned_to"),
        status_text:req.body.get("status_text"),
        open:true,
        _id:generateUUID()

      }
    })
    
    .put(function (req, res){
      let project = req.params.project;
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
