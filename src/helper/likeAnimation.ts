

export const likeAnimationHandler = (x: string = "50%", y: string = "50%") => {

    // console.log("123456978")


    // Create a new HTML element (span)
    const heartElement = document.createElement('span');

    // Set the heart emoji as the text content
    heartElement.textContent = '❤️';

    heartElement.classList.add("likeAnimation")

    // Style the heart (optional, to position it or give size)
    heartElement.style.position = 'fixed';
    heartElement.style.top = y;
    heartElement.style.left = x;
    heartElement.style.transform = 'translate(-50%, -50%)';
    heartElement.style.fontSize = '3.5rem'; // You can change the size
    heartElement.style.zIndex = '1000'; // Make sure it's visible over other content

    // Append the heart element to the body
    document.body.appendChild(heartElement);

    // Set a timeout to remove the heart after 1 second (1000 milliseconds)

    setTimeout(() => {
        heartElement.remove(); // Remove the heart from the DOM
    }, 1000);

}

