/*
 *  GET editor page.
 */

exports.editor = function(req, res){
    res.render('editor', { title: 'Editor', player: req.query.player });
};
