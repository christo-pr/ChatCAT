const helpers = require('../helpers');
const passport = require('passport');
const config = require('../config');

module.exports = () => {
	let routes = {
		'get': {
			'/': (req, res, next) => {
				res.render('login')
			},
			'/rooms': [helpers.isAuthenticated, (req, res, next) => {
				res.render('rooms', {user: req.user, host: config.HOST})
			}],
			'/chat/:id': [helpers.isAuthenticated, (req, res, next) => {
        let getRoom = helpers.findRoomById(req.app.locals.chatrooms, req.params.id)
        console.log('getRoom: ', getRoom);
        console.log('req.app.locals.chatrooms: ', req.app.locals.chatrooms);
        if (!getRoom) {
          return next();
        } else {
          res.render('chatroom', {user: req.user, host: config.HOST, room:getRoom.room, roomID: getRoom.roomID})
        }
			}],
			'/auth/facebook': passport.authenticate('facebook'),
			'/auth/facebook/callback': passport.authenticate('facebook', {
				successRedirect: '/rooms',
				failureRedirect: '/'
			}),
			'/auth/twitter': passport.authenticate('twitter'),
			'/auth/twitter/callback': passport.authenticate('twitter', {
				successRedirect: '/rooms',
				failureRedirect: '/'
			}),
			'/logout': (req, res, next) => {
				req.logout();
				res.redirect('/')
			}
		},
		'post': {},
		'NA': (req, res, next) => {
			res.status(404).sendFile(process.cwd() + '/views/404.htm')
		}
	}

	return helpers.route(routes);
}
