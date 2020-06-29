// Classes
class Vehicle {
    constructor(brand, model, plate) {
        this.brand = brand;
        this.model = model;
        this.plate = plate;
    }
}

class UI {
    static showVehicles(){
        console.log('Showing vehicles on UI...');
        const vehicles = Data.getVehicles();
        vehicles.forEach(element => {
            this.addVehicle(element);
        });
    }

    static addVehicle(vehicle) {
        console.log('Adding vehicle to view...');
        
        // get table of vehicles
        const vehicles = document.querySelector('#vehicles-list');

        // create new row with vehicle data
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${vehicle.brand}</td>
            <td>${vehicle.model}</td>
            <td>${vehicle.plate}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        // add new row to table of vehicles
        vehicles.appendChild(newRow);
    }

    // We don't need here any parameter: this is for the view, it knows the row that has to delete, and how to get data from it to delete data from local storage
    static deleteVehicle(e) {
        console.log('Deleting vehicle from view...');
        // check if we clicked the button
        if (e.classList.contains('delete')) {
            console.log('Clicked delete button...');
            e.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, style){
        const div = document.createElement('div');
        div.className = `alert alert-${style}`;
        div.appendChild(document.createTextNode(message));

        const container = document.querySelector('.container');
        const form = document.querySelector('#vehicle-form');
        container.insertBefore(div, form);

        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields(){
        console.log('Clearing fields from form...');
        document.querySelector('#brand').value = '';
        document.querySelector('#model').value = '';
        document.querySelector('#number-plate').value = '';
    }
}

class Data {
    static getVehicles() {
        console.log('Getting vehicles from data...');
        const vehicles = localStorage.getItem('vehicles');
        if (vehicles === null) return [];
        else return JSON.parse(vehicles);
    }

    static addVehicle(vehicle){
        console.log('Adding vehicle to data...');
        const vehicles = this.getVehicles();
        vehicles.push(vehicle);
        localStorage.setItem('vehicles', JSON.stringify(vehicles));
    }

    static deleteVehicle(plate){
        console.log(`Deleting vehicle ${plate} from data...`);
        const vehicles = this.getVehicles();
        vehicles.forEach((vehicle, index) => {
            if (vehicle.plate === plate)
                vehicles.splice(index, 1);
        });      
        localStorage.setItem('vehicles', JSON.stringify(vehicles));
    }
}

// show stored vehicles on page loading
document.addEventListener('DOMContentLoaded', UI.showVehicles());

// add event listener to submit button
document.querySelector("#vehicle-form").addEventListener('submit', (e) => {
    // Cancel default behaviour
    e.preventDefault();

    // Get data from form
    const brand = document.querySelector('#brand').value;
    const model = document.querySelector('#model').value;
    const plate = document.querySelector('#number-plate').value;

    // Check for null fields
    if (brand === '' || model === '' || plate === '') {
        UI.showAlert('Empty fields not allowed.', 'danger');
    } else { // All of the fields are introduced
        // create a new Vehicle with the data
        const vehicle = new Vehicle(brand, model, plate);
        // add vehicle to data
        Data.addVehicle(vehicle);
        // update view
        UI.addVehicle(vehicle);
        // show success message
        UI.showAlert(`Vehicle ${vehicle.brand} ${vehicle.model} successfully added`, 'success');
        // clear form
        UI.clearFields();
        // inform of correct addition

    }

})

// add event listener to delete button
document.querySelector('#vehicles-list').addEventListener('click', (e) => {
    // cancel default click behaviour. Doing this, the page does not jump to the beginning when clicking the button
    e.preventDefault();
    // delete vehicle from view
    UI.deleteVehicle(e.target);
    // delete vehicle from data
    const plate = e.target.parentElement.previousElementSibling.textContent;
    Data.deleteVehicle(plate);
    // inform successful deletion
    UI.showAlert(`Vehicle with number plate ${plate} has been deleted.`, 'success');
})



































