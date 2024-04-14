document.addEventListener('DOMContentLoaded', () => {
    const dogForm = document.getElementById('dog-form');
    const tableBody = document.getElementById('table-body');

    // Function to fetch dogs from the API
    function fetchDogs() {
        fetch('http://localhost:3000/dogs')
            .then(response => response.json())
            .then(renderDogs)
            .catch(error => console.error('Error fetching dogs:', error));
    }

    // Function to render dogs in the table
    function renderDogs(dogs) {
        tableBody.innerHTML = '';
        dogs.forEach(dog => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${dog.name}</td>
                <td>${dog.breed}</td>
                <td>${dog.sex}</td>
                <td><button class="edit-btn" data-id="${dog.id}">Edit</button></td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Function to pre-fill the form with dog data for editing
    function populateForm(dog) {
        dogForm.elements['name'].value = dog.name;
        dogForm.elements['breed'].value = dog.breed;
        dogForm.elements['sex'].value = dog.sex;
        dogForm.dataset.id = dog.id; // Store the dog's ID in a dataset attribute
    }

    // Event listener for editing a dog
    tableBody.addEventListener('click', event => {
        if (event.target.classList.contains('edit-btn')) {
            const dogId = event.target.dataset.id;
            fetch(`http://localhost:3000/dogs/${dogId}`)
                .then(response => response.json())
                .then(populateForm)
                .catch(error => console.error('Error fetching dog for editing:', error));
        }
    });

    // Event listener for form submission (editing a dog)
    dogForm.addEventListener('submit', event => {
        event.preventDefault();
        const dogId = dogForm.dataset.id;
        const formData = new FormData(dogForm);
        const updatedDog = {
            name: formData.get('name'),
            breed: formData.get('breed'),
            sex: formData.get('sex')
        };
        fetch(`http://localhost:3000/dogs/${dogId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedDog)
        })
        .then(response => response.json())
        .then(fetchDogs) // Refresh the table after updating the dog
        .catch(error => console.error('Error updating dog:', error));
    });

    // Fetch and render dogs on page load
    fetchDogs();
});
