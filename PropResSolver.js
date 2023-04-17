function union(setA, setB) {
  const union = new Set(setA);

  for (const elem of setB) {
      union.add(elem);
  }

  return union;
}

set = []

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
    //literalNeg = "¬q"
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

    if (set[clause1].has(literal) && set[clause2].has(literalNeg)){
      set1 = new Set([])
      set1 = union(set[clause1], ([]))
      set1.delete(literal)
      set2 = new Set([])
      set2 = union(set[clause2], ([]))
      set2.delete(literalNeg)

      set[set.length] = union(set1, set2)

    }
    else if(set[clause1].has(literalNeg) && set[clause2].has(literal)){
      set1 = new Set([])
      set1 = union(set[clause1], ([]))
      set1.delete(literalNeg)
      set2 = new Set([])
      set2 = union(set[clause2], ([]))
      set2.delete(literal)

      set[set.length] = union(set1, set2)
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