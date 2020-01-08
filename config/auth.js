exports.isLogin = async (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash('warning_msg', 'Please log in.');
        res.redirect('/user/login');
    }
};

// exports.isUser = async (req, res, next) => {
//     if (req.isAuthenticated() && req.user.role == "user") {
//         next();
//     } else {
//         req.flash('warning_msg', 'Please log in.');
//         res.redirect('/user/login');
//     }
// };

// exports.isAdmin = async (req, res, next) => {
//     //console.log(res.locals.user.admin);
//     if (req.isAuthenticated() && req.user.role == "admin") {
//         next();
//     } else {
//         req.flash('warning_msg', 'Please log in as admin.');
//         res.redirect('/');
//     }
// };