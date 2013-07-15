exports.list = function (req, res) {
    res.send([
        { 'name': 'RSS' },
        { 'name': 'File Watcher' }
    ]);
};