function handleImageUpload(event) {
    const inputImages = event.target.files;
    if (!inputImages.length) return;

    const previewContainer = document.getElementById('previewInputImages');
    previewContainer.innerHTML = ''; // Clear previous previews

    Array.from(inputImages).forEach((inputImage) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'image';
            previewContainer.appendChild(img);
        };
        reader.readAsDataURL(inputImage);
    });

    document.getElementById('loader-container').style.display = 'flex';
    document.getElementById('loader').style.display = 'block';
    document.getElementById('outputImages').style.display = 'none';
    
    const outputImagePaths = Array.from(inputImages).map(image => `/output/${image.name}`);

    setTimeout(() => {
        Promise.all(outputImagePaths.map(path => fetch(path)))
            .then(responses => {
                const outputImagesContainer = document.getElementById('outputImages');
                outputImagesContainer.innerHTML = ''; // Clear previous output

                responses.forEach((response, index) => {
                    if (response.ok) {
                        const img = document.createElement('img');
                        img.src = outputImagePaths[index];
                        img.className = 'output-image';
                        outputImagesContainer.appendChild(img);
                    } else {
                        alert(`Upscaled image not found for ${inputImages[index].name}.`);
                    }
                });
                outputImagesContainer.style.display = 'flex'; // Show output images
                document.getElementById('downloadButton').setAttribute('href', outputImagePaths.join(','));
                document.getElementById('downloadContainer').style.display = 'block'; // Show download button
            })
            .catch(error => {
                console.error("Error:", error);
                alert("An error occurred while fetching the upscaled images.");
            })
            .finally(() => {
                document.getElementById('loader').style.display = 'none';
            });
    }, 10000); // Change timeout to 30 seconds
}
