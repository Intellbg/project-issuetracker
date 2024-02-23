'use strict';
// assigned_to and status_text.
let projects = []
const REQUIERE_FIELDS = ["issue_title", "issue_text", "created_by"]
const OPTIONAL_FIELDS = ["assigned_to", "status_text"]
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(function (req, res) {
      let project = req.params.project;
      let querry_params = req.query;
      let filtered_projects = projects.filter(item => item.project == project )
      if (querry_params) {
        filtered_projects = filtered_projects.filter(item => {
          for (const key in querry_params) {
            if (item.hasOwnProperty(key)) {
              if (item[key] !== undefined && item[key] !== querry_params[key]) {
                return false;
              }
            }
          }
          return true;
        });
      }
      return res.json(filtered_projects)
    })

    .post(function (req, res) {
      let project = req.params.project;
      if (!REQUIERE_FIELDS.every(attribute => req.body.hasOwnProperty(attribute))) {
        return res.json({ error: "required field(s) missing" })
      }
      project = {
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        created_on: new Date().toISOString(),
        updated_on: new Date().toISOString(),
        assigned_to: req.body.assigned_to || "",
        status_text: req.body.status_text || "",
        open: true,
        project: project,
        _id: generateUUID()
      }
      projects.push(project)
      return res.status(201).json(project)
    })

    .put(function (req, res) {
      let project = req.params.project;
      const { _id } = req.body
      if (!_id) {
        return res.json({ error: 'missing _id' })
      }
      if (
        (!REQUIERE_FIELDS.some(attribute => req.body.hasOwnProperty(attribute))) &
        (!OPTIONAL_FIELDS.some(attribute => req.body.hasOwnProperty(attribute)))
      ) {
        return res.json({ error: 'no update field(s) sent', '_id': _id })
      }
      let selected_project = projects.filter(item => item._id === _id )
      if (selected_project.length==0) {
        return res.json({ error: 'could not update', '_id': _id })
      }
      projects = projects.map(obj => {
        if (obj._id === _id) {
          Object.keys(req.body).forEach(key => {
            obj[key]=req.body[key]
          });
          obj.updated_on = new Date().toISOString()
        }
        return obj; 
      });
      selected_project = projects.filter(item => item._id === _id )
      return res.json({ result: 'successfully updated', '_id': _id })
    })

    .delete(function (req, res) {
      let project = req.params.project;
      const { _id } = req.body
      if (!_id) {
        return res.json({ error: 'missing _id' })
      }
      let selected_project = projects.filter(item => item._id === _id )
      if (selected_project.length==0) {
        return res.json({ error: 'could not delete', '_id': _id })
      }
      projects=projects.filter(obj => obj._id != _id);
      return res.json({ result: 'successfully deleted', '_id': _id })
    });

};
