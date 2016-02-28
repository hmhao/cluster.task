var cluster = require('cluster');

function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

function ClusterTask(cmd, data, callback){
    if(typeof cmd === 'undefined') throw new Error('cmd is undefined');
    if(typeof data === 'function'){
        callback = data;
        data = undefined;
    }
    this.id = guid();
    this.cmd = cmd;
    this.data = data;
    this.callback = callback;
}
ClusterTask.transformTask = function(task){
    if(typeof task === 'undefined') throw new Error('task is undefined');
    if (task instanceof ClusterTask) return task;
    if(typeof task === 'object'){
        var cTask = new ClusterTask(task.cmd, task.data, task.callback);
        if(task.id){
            cTask.id = task.id;
        }
        return cTask;
    }
};

function ClusterTaskCtrl(task){
    this.task = task;
    this.callback = task.callback;//worker.send无法传递function
    this.task.callback = !! this.callback;//将task的callback改用Boolean表示该task需要worker返回结果
    this.results = [];//workers返回的结果
    var timeout = 3000,//超时设置
        time = 0;
    this.start = function(){
        time = setTimeout(this.end, timeout);
    };
    this.end = function(){
        clearTimeout(time);
        this.callback && this.callback(this.results);
    }.bind(this);
}

function ClusterTaskManager(){
    if (!(this instanceof ClusterTaskManager)) return new ClusterTaskManager();

    var self = this;
    this.id = guid();
    this.tasks = {};//任务队列

    /*this.onMessage = function(msg){
        console.log(self.id + ' master receive worker_'+this.id+' msg');
        console.log(msg,self.tasks);
        var task = self.tasks[msg.id];
        task.results.push(msg.data);
        if(task.results.length >= Object.keys(cluster.workers).length){
            task.end();
        }
    };*/

    if(cluster.isMaster){
        //线程通信
        console.log('ClusterTaskManager:' + 'workers:'+Object.keys(cluster.workers).length);
        Object.keys(cluster.workers).forEach(function (id) {
            //cluster.workers[id].on('message', self.onMessage);
            cluster.workers[id].on('message', function(msg){
                /*console.log(self.id + ' master receive worker_'+this.id+' msg');
                console.log(msg,self.tasks);*/
                var task = self.tasks[msg.id];//取出worker返回结果对应的task
                task.results.push(msg.data);
                if(task.results.length >= Object.keys(cluster.workers).length){
                    task.end();//task结果收集完毕
                }
            });
        });
    }
}

ClusterTaskManager.prototype.createTask = function(cmd, data, callback){
    return new ClusterTask(cmd, data, callback);
};

ClusterTaskManager.prototype.run = function(task){
    if (!(task instanceof ClusterTask)) throw new Error('task is not a Task. Use createTask');
    var taskCtrl = new ClusterTaskCtrl(task);
    this.tasks[task.id] = taskCtrl;
    taskCtrl.start();
    console.log('run:' + cluster.isMaster+' workers:'+Object.keys(cluster.workers||{}).length);
    if(cluster.isMaster){
        Object.keys(cluster.workers).forEach(function (id) {
            console.log('master send to worker_' + id);
            //console.log(taskCtrl.task);
            cluster.workers[id].send(taskCtrl.task);
        });
    }
};

/*ClusterTaskManager.prototype.off = function(task){
    var self = this;
    Object.keys(cluster.workers).forEach(function (id) {
        cluster.workers[id].removeListener('message', self.onMessage);
    });
};*/

exports.ClusterTask = ClusterTask;
exports.ClusterManager = ClusterTaskManager;
