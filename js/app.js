const countries = document.querySelector('datalist');
const searchInput = document.querySelector('#search-input');
const date = document.querySelector('#date');
const cases = document.querySelector('.cases');
const deaths = document.querySelector('.deaths');
const recovered = document.querySelector('.recovered');
const chart = document.querySelector('.charts');
const displayCountry = document.querySelector('.display-country');

let dataChart = [];

const api = "https://api.covid19api.com/summary";

async function covid19 (country) {
	countries.innerHTML = `<option value="Select a country"></option>`;
	reloadValue(cases);
	reloadValue(recovered);
	reloadValue(deaths);

	const res = await fetch(api);
	const data = await res.json();
	console.log(country)

	if(res.status === 4 || res.status === 200) {
		date.textContent = new Date(data.Date).toDateString();

		if(country === '' || country === 'Select a country') {
			const{TotalConfirmed,TotalDeaths,TotalRecovered,NewConfirmed,NewDeaths,NewRecovered} = data.Global;
			total(TotalConfirmed, TotalRecovered, TotalDeaths);
			newUpdates(NewConfirmed, NewRecovered, NewDeaths);

			displayCountry.innerHTML = 'World Data &#8594;';
			dataChart = [TotalConfirmed, TotalRecovered, TotalDeaths];
		};
		
		data.Countries.forEach(item => {
			const option = document.createElement('option');
			option.value = item.Country;
			option.textContent = item.Country;
			countries.appendChild(option);

			if(country === item.Country) {
				total(item.TotalConfirmed, item.TotalRecovered, item.TotalDeaths);
				newUpdates(item.NewConfirmed, item.NewRecovered, item.NewDeaths);

				displayCountry.textContent = item.Country;
				dataChart = [item.TotalConfirmed, item.TotalRecovered, item.TotalDeaths];
			}
		});

		drawDataChart(dataChart);

	} else {
		chart.innerHTML = `<h3>Loading...</h3>`;
	}
}

const speed = 100;

function counting(target, element) {
	const inc = target / speed;
	const count = +element.textContent;
	if(count < target) {
		element.textContent = Math.ceil(count + inc);
		setTimeout(() => {
			counting(target, element)
		}, 1)
	} else {
		element.textContent = target;
	}
};

function total(Cases, Recovered, Deaths) {
	
	counting(Cases, cases.children[1]);

	counting(Recovered, recovered.children[1]);

	counting(Deaths, deaths.children[1]);
	//cases.children[1].textContent = Cases;
	
	//recovered.children[1].textContent = Recovered;

	//deaths.children[1].textContent = Deaths;	
};

function newUpdates(Cases, Recovered, Deaths) {
	counting(Cases, cases.children[2]);

	counting(Recovered, recovered.children[2]);

	counting(Deaths, deaths.children[2]);

	//cases.children[2].textContent = Cases;

	//recovered.children[2].textContent = Recovered;

	//deaths.children[2].textContent = Deaths;	
};

function reloadValue(element) {
	element.children[1].textContent = 0;
	element.children[2].textContent = 0;
};

function drawDataChart(data) {
	chart.innerHTML = '';
	const ctx = document.createElement('canvas');
	chart.appendChild(ctx);
	var myChart = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: ['Total Cases', 'Total Recovered', 'Total Deaths'],
			datasets: [{
				label: displayCountry.textContent,
				data: data,
				backgroundColor: ['yellow', 'green', 'red'],
			}]
		},
		options: {}
	});
}

covid19(searchInput.value);

const searchBtn = document.querySelector('.search-btn');
searchBtn.addEventListener('click', (e) => {
	e.preventDefault();
	covid19(searchInput.value);
	searchInput.value = '';
})

const input = document.getElementById("search-input");
input.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    e.preventDefault();
    document.getElementById('search-btn').click();
  }
});