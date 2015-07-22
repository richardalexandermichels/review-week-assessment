var mongoose = require('mongoose')
var _ = require('lodash')
var Task;
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
  // setup schema here
  parent: { type: Schema.Types.ObjectId, ref: 'Task'},
  name: { type: String, required: true },
  complete: { type: Boolean, required: true, default: false },
  due: Date
  
});

//virtuals

TaskSchema.virtual('timeRemaining').get(function() {
  if(!this.due){return Infinity}
  return this.due - Date.now()
})

TaskSchema.virtual('overdue').get(function() {
	if(this.due - Date.now()<0){
		return true
	}return false

})

//methods

TaskSchema.methods.addChild = function(params) {
 	params.parent = this._id
 	return this.constructor.create(params)
}

TaskSchema.methods.getChildren = function() {
	return this.constructor.find({parent:this._id}).exec()
}

TaskSchema.methods.getSiblings = function() {
	var self = this
	return this.constructor.find({parent:this.parent}).exec()
		.then(function(siblings){
			var not_me = [];
			siblings.forEach(function(ele){
				if(JSON.stringify(ele._id) !== JSON.stringify(self.id)){
					not_me.push(ele)
				}
			})
			return not_me;
		})
}



Task = mongoose.model('Task', TaskSchema);


module.exports = Task;