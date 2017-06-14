//A naive implementation of operational transformation

//NOTE : All operations have properties as 'pos'(which means position), 'ty'(which means type i.e whether insert or delete  and 'id' 
//For eg. {ty: 'ins', pos: 2, ch: 'x', pri: 0} or {ty: 'del', pos: 2}

//Every character 'i' is taken as input into the tree data structure
//Precondition for taking input is that 'i' may not be a member of the set

function sizeOf(tree) {
	return tree == null ? 0 : tree.size;
}

function pos(tree, i) {
	var base = 0;
	while (tree != null) {
		var left = tree.left;
		var p = tree.value - sizeOf(left);
		if (i < p) {
			tree = left;
		} 
		else {
			i = 1 + i - p;
			base = base + tree.value;
			tree = tree.right;
		}
	}
	return base + i;
}

function pos_inv(tree, i) {
	var answer = i;
	var x = 0;
	while (tree != null) {
		if (i < tree.value) {
			tree = tree.left;
		} else {
			i = i - tree.value;
			answer = answer - sizeOf(tree.left) + 1;
			tree = tree.right;
		}
	}
	return answer;
}

function transform(op1, op2) {
	if (op2.ty != 'ins') {
		return op1;
	}
	return transform_ins(op1, op2.pos, op2.pri);
}

function transform_ins(op1, pos, pri) {
	if (op1.ty == 'ins') {
		if (op1.pos < pos || (op1.pos == pos && op1.pri < pri)) {
			return op1;
		}
		return { 
			ty: op1.ty,
			pos: op1.pos + 1,
			ch: op1.ch,
			pri: op1.pri,
			id: op1.id
		};
	} else {
		//op1.ty is 'del'
		if (op1.pos < pos) {
			return op1;
		}
		return {
			ty: op1.ty,
			ix: op1.ix + 1,
			id: op1.id
		};
	}
}
