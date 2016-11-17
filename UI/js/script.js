function modify_qty(val,name) {
    var qty = document.getElementById(name).value;
    var new_qty = parseInt(qty,10) + val;
    
    if (new_qty < 0) {
        new_qty = 0;
    }
    if (val == 1){
        var data= document.getElementById(name);
        document.getElementById("spent").value = parseInt(document.getElementById("spent").value)+parseInt(data.dataset.multiplier);
        document.getElementById("remaining").value = parseInt(document.getElementById("remaining").value)-parseInt(data.dataset.multiplier);
        document.getElementById("influence").value = parseInt(document.getElementById("influence").value)+parseInt(data.dataset.influence);

    }
    else if(val == -1){
        var data= document.getElementById(name);
        document.getElementById("spent").value = parseInt(document.getElementById("spent").value)-parseInt(data.dataset.multiplier);
        document.getElementById("remaining").value = parseInt(document.getElementById("remaining").value)+parseInt(data.dataset.multiplier);
        document.getElementById("influence").value = parseInt(document.getElementById("influence").value)-parseInt(data.dataset.influence);
        
    }
    
    document.getElementById(name).value = new_qty;
    return new_qty;
}

function start(){
    var cost=parseInt(document.getElementById("cost").value);
    reset(cost);
}
function reset(cost){
    document.getElementById("cost").value = parseInt(cost);
    document.getElementById("spent").value = 0;
    document.getElementById("remaining").value = parseInt(cost);
    document.getElementById("influence").value = 0;

    document.getElementById("qty1").value = 0;
    document.getElementById("qty2").value = 0;
    document.getElementById("qty3").value = 0;
    document.getElementById("qty4").value = 0;
    document.getElementById("qty5").value = 0;
    document.getElementById("qty6").value = 0;
    document.getElementById("qty7").value = 0;
    document.getElementById("qty8").value = 0;
    document.getElementById("qty9").value = 0;
    document.getElementById("qty10").value = 0;
    document.getElementById("qty11").value = 0;
    document.getElementById("qty12").value = 0;
    document.getElementById("qty13").value = 0;
    document.getElementById("qty14").value = 0;
    document.getElementById("qty15").value = 0;
    document.getElementById("qty16").value = 0;
    document.getElementById("qty17").value = 0;
    document.getElementById("qty18").value = 0;
    document.getElementById("qty19").value = 0;
    document.getElementById("qty20").value = 0;
    document.getElementById("qty21").value = 0;
    document.getElementById("qty22").value = 0;
    document.getElementById("qty23").value = 0;
    document.getElementById("qty24").value = 0;
    document.getElementById("qty25").value = 0;
    document.getElementById("qty26").value = 0;
    document.getElementById("qty27").value = 0;


}
function fire_bringer(val,name){
    var cost=prompt("how much does this Fire Bringer cost?");
    var data= document.getElementById(name);
    data.dataset.multiplier = cost;
    modify_qty(val,name);
}


/*notes:
 add rues for free characters aka if i have 3 of one type this usit is free  
 make clicking make a picture larger
 make top bar scroll with you so price is always visible 

Bosses
Geronimo
Human Sitting Bull
Irontooth
Legendary Sitting Bull
Sitting Bull
Chief Raven Spirit
Underbosses
Sky Spirit-145-2
Stonefist-165-1
White Buffalo-165-3
Sidekicks
Braves of the Great Spirit-100-1
Spirit Apparition-0-0
Ironhawk-175-1
Littleclaw-50-1****
Ravenseye-115-1
Walks Looking-95-1
Hired Hands
Close Combat Braves*-10*****
Long Range Braves*-10
Close Combat Scalpers*-15***
Long Range Scalpers*-15
Small Spirit Totem-5-1
Large Spirit Totem-20-3
Light Support
Brave with Gatling Gun*-30*****(braves)
Brave with Spirit Crossbow*-25
Fire Bringer* 50/60/70/80
Energy Beast-80
Heavy Support
Great Elk-200
Fire Eagl-225

*/
