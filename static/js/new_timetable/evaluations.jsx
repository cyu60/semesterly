var Evaluation = React.createClass({
	render: function() {
		var classes = this.props.selected ? "eval-item selected" : "eval-item"
		var details = !this.props.selected ? null : (
			<div id="details">{this.props.eval_data.summary.replace(/\u00a0/g, " ")}</div>
			)
		return (
		<div className={classes} onClick={this.props.selectionCallback} >
			<div className="year">{this.props.eval_data.year}</div>
			<div className="rating-wrapper">
				<div className="star-ratings-sprite">
					<span style={{width: 100*this.props.eval_data.score/5 + "%"}} className="rating"></span>
				</div>
				<div className="numeric-rating">{"(" + this.props.eval_data.score + ")"}</div>
			</div>
			{details}
		</div>);
	},
});

module.exports = React.createClass({
	
	getInitialState: function() {
		return {
			indexSelected: null
		}
	},

	render: function() {
		var i = 0;
		var evals = this.props.eval_info.map(function(e) {
			i++;
			var selected = i == this.state.indexSelected;
			return (<Evaluation eval_data={e} key={e.id} selectionCallback={this.changeSelected(i)} selected={selected} />);
		}.bind(this));
		var click_notice = this.props.eval_info.length == 0 ? (<div id="empty-intro">No course evaluations for this course yet</div>) : (<div id="click-intro">Click an evaluation item above to read the comments</div>);
		return (
		<div className="modal-entry" id="course-evaluations">
			<h6>Course Evaluations:</h6>
			<div className="eval-wrapper">
				{evals}
			</div>
			{click_notice}
		</div>);
	},

	changeSelected: function(e_index) {
		return (function() {
			if (this.state.indexSelected == e_index) 
				this.setState({indexSelected: null});
			else
				this.setState({indexSelected: e_index});
		}.bind(this));
	}
});