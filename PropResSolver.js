

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

var edges1 = new vis.DataSet([
  // {from: 3, to: 2},
  // {from: 2, to: 4},
  // {from: 2, to: 5}
]);

// create a network

var container = document.getElementById('mynetwork');
console.log(container)
// provide the data in the vis format
var data = {
  nodes: nodes,
  edges: edges
};

var data1 = {
  nodes: nodes,
  edges: edges1
};
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
    var clause1 =  document.getElementById("clause1").value;
    var clause2 =  document.getElementById("clause2").value;
  
    //takes user input on the propositions to resolve against
    literal = document.getElementById("literal").value;
    literalNeg = "¬".concat(literal)
    console.log(set[clause1])
    console.log(set[clause2])
    console.log(literal)
    console.log(literalNeg)

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

      network.body.data.nodes.add([ {id: (3*resIteration)-2, label: `${string1}`}])
      network.body.data.nodes.add([ {id: (3*resIteration)-1, label: `${string2}`}])
      network.body.data.nodes.add([ {id: (3*resIteration), label: `${string3}`}])


      network.body.data.edges.add([{from: (3*resIteration)-2, to: (3*resIteration)}])
      network.body.data.edges.add([{from: (3*resIteration)-1, to: (3*resIteration)}])

      resIteration++; 
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

      network.body.data.nodes.add([ {id: (3*resIteration)-2, label: `${string1}`}])
      network.body.data.nodes.add([ {id: (3*resIteration)-1, label: `${string2}`}])
      network.body.data.nodes.add([ {id: (3*resIteration), label: `${string3}`}])


      network.body.data.edges.add([{from: (3*resIteration)-2, to: (3*resIteration)}])
      network.body.data.edges.add([{from: (3*resIteration)-1, to: (3*resIteration)}])
      
      resIteration++;
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
  document.getElementById("output").innerHTML = "The clauses are:" +val;

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

// var input = "<p,¬q><q,r><p,r>"

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