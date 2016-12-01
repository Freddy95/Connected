function addPreference(){
  list = document.getElementById("Preferences");
  item = document.getElementById("Preference").value;
  document.getElementById("Preference").value="";
  console.log(item);
  element = document.createElement('li');
  element.innerHTML = item;
  list.appendChild(element);
}
