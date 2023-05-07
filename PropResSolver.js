function union(setA, setB) {
  const union = new Set(setA);

  for (const elem of setB) {
      union.add(elem);
  }

  return union;
}

set = []
resIteration = 1


// create an array with nodes
var nodes = new vis.DataSet([
  // {id: 1, label: 'Node 1'},
  // {id: 2, label: 'Node 2'},
  // {id: 3, label: 'Node 3'},
  // {id: 4, label: 'Node 4'},
  // {id: 5, label: 'Node 5'}
]);

// create an array with edges
var edges = new vis.DataSet([
  // {from: 1, to: 2}
]);

// var edges1 = new vis.DataSet([
//   // {from: 3, to: 2},
//   // {from: 2, to: 4},
//   // {from: 2, to: 5}
// ]);

// create a network

var container = document.getElementById('mynetwork');
console.log(container)
// provide the data in the vis format
var data = {
  nodes: nodes,
  edges: edges
};

// var data1 = {
//   nodes: nodes,
//   edges: edges1
// };
var options = {
  layout: {
    hierarchical: {
      direction: 'UD',
      sortMethod: 'directed'
    }
  },
  physics: {
    enabled: false
  }

  
};

var network = new vis.Network(container, data, options);

//We want to form an array, where each clause is a set
// var input = "<a,b,¬c><¬a><a,b,c><a,¬b>" {a,b,¬c}{¬a}{a,b,c}{a,¬b}
function getFormula(){
  var input = document.getElementById("CNF").value;
  var item = input.split("}{");
  item[0] = item[0].replace("{", "")
  item[item.length-1] = item[item.length-1].replace("}", "")

  //set = []

  //while loop which puts our propositions into an array of sets.
  for (let i = 0; i < item.length; i++) {
      array = item[i].split(",")
      set[i] = new Set([])
      for (let j = 0; j < array.length; j++){
          set[i].add(array[j])
      }
    }
  var items;
  var val = ''  
  for (let i = 0; i < set.length; i++) {
    for (items of set[i].values()){
      val+=items + ' '; 
    }
    val+="|"
  }

  console.log(set)
  document.getElementById("output").innerHTML = "The clauses are: " +val;

}
// var input = document.getElementById("CNF").value;
// var item = input.split("><");
// item[0] = item[0].replace("<", "")
// item[item.length-1] = item[item.length-1].replace(">", "")

// set = []

// //while loop which puts our propositions into an array of sets.
// for (let i = 0; i < item.length; i++) {
//     array = item[i].split(",")
//     set[i] = new Set([])
//     for (let j = 0; j < array.length; j++){
//         set[i].add(array[j])
//     }
//   }



function resolve(){
    // Take user input on clauses to resolve
    var clause1 =  (document.getElementById("clause1").value)-1;
    var clause2 =  (document.getElementById("clause2").value)-1;
  
    //takes user input on the propositions to resolve against
    literal = document.getElementById("literal").value;
    literalNeg = "¬".concat(literal)
    console.log(set[clause1])
    console.log(set[clause2])
    console.log(literal)
    console.log(literalNeg)

    clause1exists = false
    clause2exists = false
    resExists = false

    clause1used = false
    clause2used = false

    // clause1index;
    // clause2index;
    // //change into different cases.
    // if( (set[clause1].has(literal) && set[clause2].has(literalNeg)) || (set[clause1].has(literalNeg) && set[clause2].has(literal))){
    //   set[set.length] = union(set[clause1], set[clause2])
    //   set[set.length-1].delete(literal)
    //   set[set.length-1].delete(literalNeg) 
    //   console.log("if statement?")//code successfully resolves.
    // }

    if (set[clause1].has(literal) && set[clause2].has(literalNeg)){//intially code that the new set is just the combination of the 2 clauses
      set1 = new Set([]) //minus the resolving clauses, however its possible that a literal which is the same as the complement isn't supposed to be removed, and therefore reworked
      set1 = union(set[clause1], ([])) //to ensure that only the resolving literal are removed
      set1.delete(literal)
      set2 = new Set([])
      set2 = union(set[clause2], ([]))
      set2.delete(literalNeg)

      set[set.length] = union(set1, set2)

      string1 = Array.from(set[clause1]).join(',')
      string2 = Array.from(set[clause2]).join(',')
      string3 = Array.from(set[set.length-1]).join(',')

      currentNodes = network.body.data.nodes.get()
      for (let i=0; i<currentNodes.length;  i++){
        console.log(currentNodes[i].label)
        if (currentNodes[i].label == string1){
          clause1exists = true
          clause1index = i+1
        }
        else if (currentNodes[i].label == string2){
          clause2exists = true
          clause2index = i+1
        }
        else if (currentNodes[i].label == string3){
          resExists = true
        }
      }
      console.log(clause1exists)
      console.log(string1)
      console.log(clause2exists)
      console.log(string2)
      console.log(currentNodes)

      if(clause1exists){
        //clause1edges = network.GetConnectedEdges(clause1index)
        clause1edges = edges.get().filter(function (edge) {
          return edge.from === clause1index
        });
        for (var i = 0; i < clause1edges.length; i++) {
          var edge = clause1edges[i];
          if (edge.from === clause1index) {
            clause1used = true
          }
        }
      }

      if(clause2exists){
        //clause2edges = network.GetConnectedEdges(clause2index)
        clause2edges = edges.get().filter(function (edge) {
          return edge.from === clause2index
        });
        for (var i = 0; i < clause2edges.length; i++) {
          var edge = clause2edges[i];
          if (edge.from === clause2index) {
            clause2used = true
          }
        }
      }

      if (clause1exists == true && clause2exists == true){
        //check if there is an outgoing edge of these clauses. If there is, create new edges, if not delete
        //from each edge, there is an edge from and an edge to.
        //get all edges connected to an existing clause. loop through until an edge goes from the clause
        //if there is an edge from, create new node
        //if not, use existing node
        
        if (clause1used == true && clause2used == true){
          //both exist but are already used. Add new nodes for both
          network.body.data.nodes.add([ {id: network.body.data.nodes.get().length+1, label: `${string1}`}])
          network.body.data.nodes.add([ {id: network.body.data.nodes.get().length+1, label: `${string2}`}])
          network.body.data.nodes.add([ {id: network.body.data.nodes.get().length+1, label: `${string3}`}])
  
          network.body.data.edges.add([{from: network.body.data.nodes.get().length-2, to: network.body.data.nodes.get().length}])
          network.body.data.edges.add([{from: network.body.data.nodes.get().length-1, to: network.body.data.nodes.get().length}])

        }
        else if (clause1used == true && clause2used == false){
          //both exist, but only clause 1 is used. Add a new node for clause 1, add edges to this new clause and connect to clause 2 
          network.body.data.nodes.add([{id: network.body.data.nodes.get().length+1, label: `${string1}`}])
          network.body.data.nodes.add([{id: network.body.data.nodes.get().length+1, label: `${string3}`}])

          network.body.data.edges.add([{from: network.body.data.nodes.get().length-1, to: network.body.data.nodes.get().length}])
          network.body.data.edges.add([{from: clause2index, to: network.body.data.nodes.get().length}])
        }
        else if (clause1used == false && clause2used == true){
          //both exist, only clause 2 is used. Add a new node for clause 2, add edges to this new clause and to clause 1
          network.body.data.nodes.add([{id: network.body.data.nodes.get().length+1, label: `${string2}`}])
          network.body.data.nodes.add([{id: network.body.data.nodes.get().length+1, label: `${string3}`}])

          network.body.data.edges.add([{from: network.body.data.nodes.get().length-1, to: network.body.data.nodes.get().length}])
          network.body.data.edges.add([{from: clause1index, to: network.body.data.nodes.get().length}])

        }
        else if (clause1used == false &&  clause2used == false){
          network.body.data.nodes.add([ {id: network.body.data.nodes.get().length+1, label: `${string3}`}])

          network.body.data.edges.add([{from: clause1index, to: network.body.data.nodes.get().length}]) 
          network.body.data.edges.add([{from: clause2index, to: network.body.data.nodes.get().length}])

          console.log(clause1index)
          console.log(clause2index)
        }

        //make node of the resolved clause
        //connect node of resolved clause to clause 1 and clause 2
        // network.body.data.nodes.add([ {id: network.body.data.nodes.get()+1, label: `${string3}`}])

        // network.body.data.edges.add([{from: clause1index, to: network.body.data.nodes.get().length}]) 
        // network.body.data.edges.add([{from: clause2index, to: network.body.data.nodes.get().length}])

      }
      else if (clause1exists == true && clause2exists == false){
        //make node for clause 2 and for the resolved clause
        //connect the edges from clause 1 and clause 2 to the resolved clause

        //we only need to check if the existing clause has a node, if/else statements
        if (clause1used == true){//make new nodes
          network.body.data.nodes.add([ {id: network.body.data.nodes.get().length+1, label: `${string1}`}])
          network.body.data.nodes.add([ {id: network.body.data.nodes.get().length+1, label: `${string2}`}])
          network.body.data.nodes.add([ {id: network.body.data.nodes.get().length+1, label: `${string3}`}])
  
          network.body.data.edges.add([{from: network.body.data.nodes.get().length-2, to: network.body.data.nodes.get().length}])
          network.body.data.edges.add([{from: network.body.data.nodes.get().length-1, to: network.body.data.nodes.get().length}])
        }
        else{//use existing node for clause 1
          network.body.data.nodes.add([ {id: network.body.data.nodes.get().length+1, label: `${string2}`}])
          network.body.data.nodes.add([ {id: network.body.data.nodes.get().length+1, label: `${string3}`}])

          network.body.data.edges.add([{from: clause1index, to: network.body.data.nodes.get().length}]) 
          network.body.data.edges.add([{from: network.body.data.nodes.get().length-1, to: network.body.data.nodes.get().length}])
        }

        
      }
      else if (clause1exists == false && clause2exists == true){
        if (clause2used == true){//create new node
          network.body.data.nodes.add([ {id: network.body.data.nodes.get().length+1, label: `${string1}`}])
          network.body.data.nodes.add([ {id: network.body.data.nodes.get().length+1, label: `${string2}`}])
          network.body.data.nodes.add([ {id: network.body.data.nodes.get().length+1, label: `${string3}`}])
  
          network.body.data.edges.add([{from: network.body.data.nodes.get().length-2, to: network.body.data.nodes.get().length}])
          network.body.data.edges.add([{from: network.body.data.nodes.get().length-1, to: network.body.data.nodes.get().length}])
        }
        else{ //used existing node for clause 2
          network.body.data.nodes.add([ {id: network.body.data.nodes.get().length+1, label: `${string1}`}])
          network.body.data.nodes.add([ {id: network.body.data.nodes.get().length+1, label: `${string3}`}])
  
          network.body.data.edges.add([{from: clause2index, to: network.body.data.nodes.get().length}]) 
          network.body.data.edges.add([{from: network.body.data.nodes.get().length-1, to: network.body.data.nodes.get().length}])
        }
        
      }
      else if (clause1exists == false && clause2exists == false){
        network.body.data.nodes.add([ {id: network.body.data.nodes.get().length+1, label: `${string1}`}])
        network.body.data.nodes.add([ {id: network.body.data.nodes.get().length+1, label: `${string2}`}])
        network.body.data.nodes.add([ {id: network.body.data.nodes.get().length+1, label: `${string3}`}])

        network.body.data.edges.add([{from: network.body.data.nodes.get().length-2, to: network.body.data.nodes.get().length}])
        network.body.data.edges.add([{from: network.body.data.nodes.get().length-1, to: network.body.data.nodes.get().length}])
      }
    }
    else if(set[clause1].has(literalNeg) && set[clause2].has(literal)){
      set1 = new Set([])
      set1 = union(set[clause1], ([]))
      set1.delete(literalNeg)
      set2 = new Set([])
      set2 = union(set[clause2], ([]))
      set2.delete(literal)

      set[set.length] = union(set1, set2)

      // network.body.data.nodes.add([ {id: 1, label: `${set[clause1]}`}]) //able to create tree, however need to fix labels
      // network.body.data.nodes.add([ {id: 2, label: `${set[clause2]}`}])
      // network.body.data.nodes.add([ {id: 3, label: `${set[set.length-1]}`}])

      string1 = Array.from(set[clause1]).join(',')
      string2 = Array.from(set[clause2]).join(',')
      string3 = Array.from(set[set.length-1]).join(',')

      currentNodes = network.body.data.nodes.get()
      for (let i=0; i<currentNodes.length;  i++){
        console.log(currentNodes[i].label)
        if (currentNodes[i].label == string1){
          clause1exists = true
          clause1index = i+1
        }
        else if (currentNodes[i].label == string2){
          clause2exists = true
          clause2index = i+1
        }
        else if (currentNodes[i].label == string3){
          resExists = true
        }
      }
      console.log(clause1exists)
      console.log(string1)
      console.log(clause2exists)
      console.log(string2)
      console.log(currentNodes)

      //loops check if the clause is used in a resolution already

      if(clause1exists){
        //clause1edges = network.GetConnectedEdges(clause1index)
        clause1edges = edges.get().filter(function (edge) {
          return edge.from === clause1index
        });
        for (var i = 0; i < clause1edges.length; i++) {
          var edge = clause1edges[i];
          if (edge.from === clause1index) {
            clause1used = true
          }
        }
      }

      if(clause2exists){
        //clause2edges = network.GetConnectedEdges(clause2index)
        clause2edges = edges.get().filter(function (edge) {
          return edge.from === clause2index
        });
        console.log(clause2edges)
        //console.log(clause2index)
        //console.log(network.body.edges)
        //console.log(clause2edges[i].from)

        //if there are no outgoing edges, clause2used is false, we do nothing
         

        for (var i = 0; i < clause2edges.length; i++) {
          var edge = clause2edges[i]; //doesn't successfully take from the edges
          console.log(clause2edges[i])
          console.log(edge)
          console.log(clause2edges)
          if (edge.from === clause2index) { //find how to actually refer to the from property
            clause2used = true
          }
        }
      }


      

      

      

      if (clause1exists == true && clause2exists == true){
        //check if there is an outgoing edge of these clauses. If there is, create new edges, if not delete
        //from each edge, there is an edge from and an edge to.
        //get all edges connected to an existing clause. loop through until an edge goes from the clause
        //if there is an edge from, create new node
        //if not, use existing node
        
        if (clause1used == true && clause2used == true){
          //both exist but are already used. Add new nodes for both
          network.body.data.nodes.add([ {id: network.body.data.nodes.get().length+1, label: `${string1}`}])
          network.body.data.nodes.add([ {id: network.body.data.nodes.get().length+1, label: `${string2}`}])
          network.body.data.nodes.add([ {id: network.body.data.nodes.get().length+1, label: `${string3}`}])
  
          network.body.data.edges.add([{from: network.body.data.nodes.get().length-2, to: network.body.data.nodes.get().length}])
          network.body.data.edges.add([{from: network.body.data.nodes.get().length-1, to: network.body.data.nodes.get().length}])

        }
        else if (clause1used == true && clause2used == false){
          //both exist, but only clause 1 is used. Add a new node for clause 1, add edges to this new clause and connect to clause 2 
          network.body.data.nodes.add([{id: network.body.data.nodes.get().length+1, label: `${string1}`}])
          network.body.data.nodes.add([{id: network.body.data.nodes.get().length+1, label: `${string3}`}])

          network.body.data.edges.add([{from: network.body.data.nodes.get().length-1, to: network.body.data.nodes.get().length}])
          network.body.data.edges.add([{from: clause2index, to: network.body.data.nodes.get().length}])
        }
        else if (clause1used == false && clause2used == true){
          //both exist, only clause 2 is used. Add a new node for clause 2, add edges to this new clause and to clause 1
          network.body.data.nodes.add([{id: network.body.data.nodes.get().length+1, label: `${string2}`}])
          network.body.data.nodes.add([{id: network.body.data.nodes.get().length+1, label: `${string3}`}])

          network.body.data.edges.add([{from: network.body.data.nodes.get().length-1, to: network.body.data.nodes.get().length}])
          network.body.data.edges.add([{from: clause1index, to: network.body.data.nodes.get().length}])

        }
        else if (clause1used == false &&  clause2used == false){
          network.body.data.nodes.add([ {id: network.body.data.nodes.get().length+1, label: `${string3}`}])

          network.body.data.edges.add([{from: clause1index, to: network.body.data.nodes.get().length}]) 
          network.body.data.edges.add([{from: clause2index, to: network.body.data.nodes.get().length}])
        }

        //make node of the resolved clause
        //connect node of resolved clause to clause 1 and clause 2
        // network.body.data.nodes.add([ {id: network.body.data.nodes.get()+1, label: `${string3}`}])

        // network.body.data.edges.add([{from: clause1index, to: network.body.data.nodes.get().length}]) 
        // network.body.data.edges.add([{from: clause2index, to: network.body.data.nodes.get().length}])

      }
      else if (clause1exists == true && clause2exists == false){
        //make node for clause 2 and for the resolved clause
        //connect the edges from clause 1 and clause 2 to the resolved clause

        //we only need to check if the existing clause has a node, if/else statements
        if (clause1used == true){//make new nodes
          network.body.data.nodes.add([ {id: network.body.data.nodes.get().length+1, label: `${string1}`}])
          network.body.data.nodes.add([ {id: network.body.data.nodes.get().length+1, label: `${string2}`}])
          network.body.data.nodes.add([ {id: network.body.data.nodes.get().length+1, label: `${string3}`}])
  
          network.body.data.edges.add([{from: network.body.data.nodes.get().length-2, to: network.body.data.nodes.get().length}])
          network.body.data.edges.add([{from: network.body.data.nodes.get().length-1, to: network.body.data.nodes.get().length}])
        }
        else{//use existing node for clause 1
          network.body.data.nodes.add([ {id: network.body.data.nodes.get().length+1, label: `${string2}`}])
          network.body.data.nodes.add([ {id: network.body.data.nodes.get().length+1, label: `${string3}`}])

          network.body.data.edges.add([{from: clause1index, to: network.body.data.nodes.get().length}]) 
          network.body.data.edges.add([{from: network.body.data.nodes.get().length-1, to: network.body.data.nodes.get().length}])
        }

        
      }
      else if (clause1exists == false && clause2exists == true){
        if (clause2used == true){//create new node
          network.body.data.nodes.add([ {id: network.body.data.nodes.get().length+1, label: `${string1}`}])
          network.body.data.nodes.add([ {id: network.body.data.nodes.get().length+1, label: `${string2}`}])
          network.body.data.nodes.add([ {id: network.body.data.nodes.get().length+1, label: `${string3}`}])
  
          network.body.data.edges.add([{from: network.body.data.nodes.get().length-2, to: network.body.data.nodes.get().length}])
          network.body.data.edges.add([{from: network.body.data.nodes.get().length-1, to: network.body.data.nodes.get().length}])
        }
        else{ //used existing node for clause 2
          network.body.data.nodes.add([ {id: network.body.data.nodes.get().length+1, label: `${string1}`}])
          network.body.data.nodes.add([ {id: network.body.data.nodes.get().length+1, label: `${string3}`}])
  
          network.body.data.edges.add([{from: clause2index, to: network.body.data.nodes.get().length}]) 
          network.body.data.edges.add([{from: network.body.data.nodes.get().length-1, to: network.body.data.nodes.get().length}])
        }
        
      }
      else if (clause1exists == false && clause2exists == false){
        network.body.data.nodes.add([ {id: network.body.data.nodes.get().length+1, label: `${string1}`}])
        network.body.data.nodes.add([ {id: network.body.data.nodes.get().length+1, label: `${string2}`}])
        network.body.data.nodes.add([ {id: network.body.data.nodes.get().length+1, label: `${string3}`}])

        network.body.data.edges.add([{from: network.body.data.nodes.get().length-2, to: network.body.data.nodes.get().length}])
        network.body.data.edges.add([{from: network.body.data.nodes.get().length-1, to: network.body.data.nodes.get().length}])
      }
    }


    var items;
    var val = ''  
    for (let i = 0; i < set.length; i++) {
      for (items of set[i].values()){
        val+=items + ' '; 
      }
      val+="|"
    }

  //console.log(set)
  document.getElementById("output").innerHTML = "The clauses are: " +val;

  for (let i = 0; i < set.length; i++) { //used for while true loop. While !emptyclause, let the loop happen.
    if (set[i].size == 0){
      document.getElementById("emptyclause").innerHTML = "empty clause has been reached";
    }
  }

}



// var emptyClause = false
// while(!emptyClause){
//   // for(let i=0; i<set.length; i++){
//   //   document.write(set[i])

//   // }

//   // document.write(console.log(
//   //   Array.from(set.values()) // prints unique Array [1, 2, 3]
//   // ))
//   // Take user input on clauses to resolve
//   var clause1 = prompt("index of first clause resolving")
//   var clause2 = prompt("index of second clause resolving")

//   //takes user input on the propositions to resolve against
//   literal = prompt("What literal do you want to resolve?")
//   literalNeg = "¬".concat(literal)
//   //literalNeg = "¬q"

//   //checks if on clause has the chosen propsoition or its opposite
//   // checks if the other clause has the oppoisite of the prpoposition, 4 if statements
//   if( (set[clause1].has(literal) && set[clause2].has(literalNeg)) || (set[clause1].has(literalNeg) && set[clause2].has(literal))){
//     set[set.length] = union(set[clause1], set[clause2])
//     set[set.length-1].delete(literal)
//     set[set.length-1].delete(literalNeg) //code successfully resolves.
//   }

//   console.log(set)

//   for (let i = 0; i < set.length; i++) { //used for while true loop. While !emptyclause, let the loop happen.
//     if (set[i].size == 0){
//       emptyClause = true
//     }
//   }

// }

// var input = "<p,¬q><q,r><p,r>" {p,¬q}{q,r}{p,r}

// var item = input.split("><");
// item[0] = item[0].replace("<", "")
// item[item.length-1] = item[item.length-1].replace(">", "")

// var outputArr = item.map(elem => elem.split(","));
// console.log(outputArr);
// console.log(item);
//We will store our propositional variables as an array of sets. The sets allow for the comparison of our clauses
//and the array will allow us to change the size of our list of conditionals.



//var network = new vis.Network(container, data1, options);

// network.body.data.edges.add([{from: 1, to: 2}]) //adds edge
// network.body.data.nodes.add([ {id: 10, label: 'another test'}]) //adds node



//visualisation ideas
//visualise after every resolution. May be useful for teaching students, but a may be redundant
//&decision
//visualise at end, need to implement a way to keep track of what resolved with what. Tree wont be built for formulaes that are unsatisfiable
//and thus isnt as useful. Should visualise after resolution
//goal for today: Implement adding the first 2 nodes.

//every time resolve is pressed, create a new network using the same options and container, but new data.
//for this new data we can add nodes and edges to the previous iteration of nodes and edges.

//doing some research, its possible to add nodes and edges and there is a function for it