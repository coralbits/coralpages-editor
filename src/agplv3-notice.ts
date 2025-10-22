import version from "./version.json";

let shown = false;

function showAgplv3Notice() {
  if (shown) return;
  shown = true;
  console.log(
    "Coralpages Editor Web Component by Coralbits SL. Under AGPLv3 License. https://www.coralbits.com/coralpages/"
  );
  console.log(
    "Beware of embedding this component in non AGPLv3 pages as thay may be a breach of license."
  );
  console.log("Version: ", version.version);
  console.log("More version info: ", version);
}

showAgplv3Notice();
