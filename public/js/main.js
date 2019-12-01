let categoryName = [{
        name: 'Company Name',
        category: 'name'
    }, {
        name: 'Code',
        category: 'code'
    }, {
        name: "Avarage Wage",
        category: "avgWage"
    }, {
        name: 'Number of Insured workers',
        category: "numInsured"
    },


];

let tableHead = document.querySelector('thead tr');
let select = document.getElementById('searchCategory');
let submitBtn = document.getElementById('submitBtn');
let keyword = document.getElementById('keyword');
let form = document.getElementById('form');


categoryName.forEach((item, idx) => {

    let th = document.createElement('th');
    th.innerText = item.name;
    tableHead.appendChild(th);


    let option = document.createElement('option');
    option.value = item.category;
    option.innerText = item.name;
    option.id = "category"

    if (item.category === 'code') {
        option.selected = true;
        option.setAttribute('selected', true);
    }

    select.appendChild(option);
});

submitBtn.addEventListener('click', search);

select.addEventListener('change', addSelected)


function search(e) {
    e.preventDefault();

    let value = keyword.value.trim();
    let category = document.querySelectorAll('#category');
    let selected = "";
    category.forEach(cat => {

        if (cat.getAttribute('selected')) {
            selected = cat.value;
        }
    })

    if (value.length < 1 && selected) {
        let warnings = document.querySelectorAll('.warning');
        warnings.forEach(item => {
            item.remove()
        })
        let warning = document.createElement('h6')
        warning.innerHTML = "Enter valid keyword";
        warning.className = "warning red";
        form.insertAdjacentElement('afterend', warning)
        return;
    }
    if (document.querySelector('.warning')) {
        document.querySelector('.warning').remove()
    }
    fetch(`http://localhost:3000/search?keyword=${value}&category=${selected}`)
        .then(res => res.json())
        .then(data => {

            let tbodyTd = document.createElement('td');
            let tbody = document.querySelector('tbody');
            tbody.innerHTML = '';
            if (data.status == 'success') {

                let html = '';
                for (let key in data.result) {
                    html += `<tr>
                    <td id="name">${ data.result[key].name}</td>
                    <td id="code">${ data.result[key].code}</td>
                    <td id="avgWage">${ data.result[key].avgWage}</td>
                    <td id="numInsured" >${ data.result[key].numInsured}</td>
                    <td><a id="downloadIcon" type="button" onclick="download1()" ><img src="icons/icons8-csv-26.png"> </a></td>
                    </tr>
        `;
                    tbody.innerHTML = html;
                }

                let action = document.getElementById('action');

                if (action) {
                    action.remove()
                }
                let th = document.createElement('th');
                th.innerHTML = 'Action'
                th.id = 'action'
                tableHead.appendChild(th)


                // data.result(item => {
                //     // name = item.name;
                //     // code = item.code;
                //     // avgWage = item.avgWage;
                //     // numInsured = item.numInsured;
                //     // tbody.appendChild(tbodyTd)
                //     html += `<tr>
                //                 <td>${item.name}</td>
                //                 <td>${item.code}</td>
                //                 <td>${item.avgWage}</td>
                //                 <td>${item.numInsured}</td>
                //                 <td><a id="icon" href="/download/${item.name}"><img src="icons/icons8-csv-26.png"> </a></td>
                //                 </tr>
                //     `;
                //     tbody.innerHTML = html;
                // })

                return
            }
            tbodyTd.innerHTML = data.result;
            tbody.appendChild(tbodyTd)

        }).catch(err => {
            console.log(err)
        })

}

function addSelected(e) {
    let category = document.querySelectorAll('#category');
    let index;
    let newIdx;

    category.forEach((cat, idx) => {

        if (cat.getAttribute('selected')) {
            index = idx;
            cat.removeAttribute('selected')
        }
        if (cat.value == e.target.value) {
            newIdx = idx;
            cat.setAttribute('selected', true)
        }
    })

}


function download1() {
    let downloadIcon = document.getElementById('downloadIcon');
    let name = document.getElementById("name").innerHTML
    let code = document.getElementById("code").innerHTML
    let avgWage = document.getElementById("avgWage").innerHTML
    let numInsured = document.getElementById("numInsured").innerHTML
    downloadIcon.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(`${name};${code};${avgWage};${numInsured}`));
    downloadIcon.setAttribute('download', name + ".csv");
    // href="data:text/plain;charset=utf-8,"
}