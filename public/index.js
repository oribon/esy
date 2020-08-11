function Dump() {
    secretName = document.getElementById("secretName").value;
    secretEngine = document.getElementById("secretEngine").value;
    vaultSecretName = document.getElementById("vaultSecretName").value;
    var arr = [];
    var arr2 = {};
    tableData = table.getData();
    for (d in tableData) {
        if (validateRow(tableData[d])) {           
            arr.push(tableData[d]);
            arr2[tableData[d].secretKey] = btoa(tableData[d].secretKey)
        }
    }

    if (document.getElementById("yes").checked) {
    esJsonObject =  {
                    "apiVersion"      : "kubernetes-client.io/v1",
                    "kind"     : "ExternalSecret",
                    "metadata"    : {
                        "name": secretName
                    },
                    "spec": {
                        "backendType": "vault",
                        "vaultRole": secretEngine + "-ro",
                        "dataFrom": [secretEngine + "/data/" + vaultSecretName]
                    }
                }
    secretJsonObject = {
                    "apiVersion"      : "v1",
                    "kind"     : "Secret",
                    "metadata"    : {
                        "name": secretName
                    },
                    "data": {
                        key1: btoa("admataiaug17"),
                        key2: btoa("kamaodaug17"),
                        key3: btoa("123ananon123")
                    },
                    "Type": "Opaque"  
                }
    document.getElementById("myTable").style.display = 'none';
    document.getElementById("add-row").style.display = 'none';
    } else {
        esJsonObject =  {
            "apiVersion"      : "kubernetes-client.io/v1",
            "kind"     : "ExternalSecret",
            "metadata"    : {
                "name": secretName
            },
            "spec": {
                "backendType": "vault",
                "vaultRole": secretEngine + "-ro",
                "data": arr
            }
        }
        secretJsonObject = {
            "apiVersion"      : "v1",
            "kind"     : "Secret",
            "metadata"    : {
                "name": secretName
            },
            "data": arr2,
            "Type": "Opaque"  
        }
        document.getElementById("myTable").style.display = 'block';
        document.getElementById("add-row").style.display = 'block';
    }

    var esTxtArea ;
    esTxtArea = document.getElementById("esYAML") ;
    esTxtArea.value = jsyaml.dump(esJsonObject, {flowLevel: 4});

    var secretTxtArea;
    secretTxtArea = document.getElementById("secretYAML") ;
    secretTxtArea.value = jsyaml.dump(secretJsonObject, {flowLevel: 4});

}

var table = new Tabulator("#myTable", {
    layout:"fitColumns",
    addRowPos:"top",
    maxHeight:"100%",
    resizableColumns: false,
    columns:[
        {title:"VaultSecret", field:"vaultSecret", editor:"input"},
	    {title:"SecretKey", field:"vaultKey", editor:"input"},
        {title:"AssignTo", field:"secretKey", editor:"input"},
        {title: "", formatter:"buttonCross", width: 10, cellClick:function(e, cell){
            cell.getRow().delete();
        }},
    ],
    rowDeleted:function(row){
        if (validateRow(row)) {
            Dump();
        }
    },
    cellEditing:function(cell){
        if (validateRow(cell.getRow())) {
            Dump();
        }
    },
    cellEdited:function(cell){
        if (validateRow(cell.getRow())) {
            Dump();
        }
    },
    cellEditCancelled:function(cell){
        if (validateRow(cell.getRow())) {
            Dump();
        } 
    }
});

document.getElementById("add-row").addEventListener("click", function(){
    secretEngine = document.getElementById("secretEngine").value;
    vaultSecretName = document.getElementById("vaultSecretName").value;
    table.addRow({vaultSecret: secretEngine + "/data/" + vaultSecretName});
});

function validateRow(row) {
    for (p in row){
        if (!row[p]){
            return false
        }
    }
    return true
}


secretNameEl = document.getElementById("secretName");
secretEngineEl = document.getElementById("secretEngine");
vaultSecretNameEl = document.getElementById("vaultSecretName");
yesButton = document.getElementById("yes");
noButton = document.getElementById("no");

secretNameEl.addEventListener("keyup", Dump);
secretEngineEl.addEventListener("keyup", Dump);
vaultSecretNameEl.addEventListener("keyup", Dump);
yesButton.addEventListener("click", Dump);
noButton.addEventListener("click", Dump);
