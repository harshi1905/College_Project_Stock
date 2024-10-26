function handleImageUpload(event) {
    const inputImage = event.target.files[0];
    if (!inputImage) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        document.getElementById('previewInputImage').src = e.target.result;
        document.getElementById('previewInputImage').style.display = 'block';
        document.getElementById('loader').style.display = 'block';
        document.getElementById('outputImage').style.display = 'none';
    };
    reader.readAsDataURL(inputImage);

    document.getElementById('loader-container').style.display = 'flex';
    document.getElementById('loader').style.display = 'block';
    document.getElementById('outputImage').style.display = 'none';

    const imageName = inputImage.name;
    const outputImagePath = `/output/${imageName}`;

    setTimeout(() => {
        fetch(outputImagePath)
            .then(response => {
                if (response.ok) {
                    // Display the upscaled image if found and hide loader
                    document.getElementById('outputImage').src = outputImagePath;
                    document.getElementById('outputImage').style.display = 'block';
                } else {
                    // If not found, show an alert and hide the output image
                    alert("Upscaled image not found in the output folder.");
                    document.getElementById('outputImage').style.display = 'none';
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("An error occurred while fetching the upscaled image.");
                document.getElementById('outputImage').style.display = 'none';
            })
            .finally(() => {
                // Hide loader after fetching the output
                document.getElementById('loader').style.display = 'none';
            });
    }, 10000);
}