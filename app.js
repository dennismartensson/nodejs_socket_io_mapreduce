var app = require('express').createServer()
var io = require('socket.io').listen(app);

app.listen(80);

var path = document.location.pathname;
var dir = path.substring(path.indexOf('/', 1)+1, path.lastIndexOf('/'));

app.get('/', function (req, res) {
	res.sendfile(dir+'/index.html');
});

var timesEach = [1]

var map_jobs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
var reduce_jobs = []
var jobs_out = []
var result = null

io.sockets.on('connection', function (socket) {

	socket.on('get_job', function (){
		if(map_jobs.length > 0){
			var job_nr_left = map_jobs.pop();
			jobs_out.push(1);
			socket.emit('map', job_nr_left, timesEach);
		}
		else if(jobs_out.length > 0 && map_jobs.length < 1){
			socket.emit('connect');
		}
		else if(reduce_jobs.length > 0 && jobs_out.length < 1){
			var reduce_jobs_out = reduce_jobs;
			reduce_jobs = [];
			socket.emit('reduce', reduce_jobs_out);
		}
		else {
			io.sockets.emit('done', result);
		}
	});

	socket.on('submit_map_job', function (sum) {
		jobs_out.pop();
		reduce_jobs.push(sum);
		socket.emit('connect');
	});

	socket.on('finalize', function (sum){
		result = sum;
		socket.emit('connect');
	})

	socket.on('disconnect', function(){
		//delete usernames[socket.username];
	});
});

