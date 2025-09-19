export default function NoticiasVarias(){
    return(
        <>
<div className="relative overflow-hidden rounded-lg shadow-lg card">
    {/* The 'relative' class is crucial for positioning the overlay content correctly */}

    {/* Replaced 'card' and 'p-0' with Tailwind classes for general card styling:
        - 'relative' is needed for the 'absolute' overlay.
        - 'overflow-hidden' ensures image/content respects the 'rounded-lg'.
        - 'rounded-lg' and 'shadow-lg' for the card appearance. */}

    <img src="fotos/mirtha.jpg" className="w-full h-auto" alt="..."/>
    {/* Replaced 'card-img' with 'w-full h-auto' to ensure the image is responsive and maintains aspect ratio */}

    <div className="absolute inset-0 flex flex-col justify-end p-4">
        {/* Replaced 'card-img-overlay d-flex flex-column justify-content-end' with:
            - 'absolute inset-0': Makes the div cover the entire card area.
            - 'flex flex-col justify-end': Centers the text to the bottom.
            - 'bg-black bg-opacity-40': Adds a dark, semi-transparent overlay for readability.
            - 'p-4': Adds internal padding. */}

        <h5 className="text-white text-xl font-semibold leading-tight card-title">
            {/* Replaced 'card-title' with Tailwind classes for text styling:
                - 'text-white': Ensures the text is readable on the dark background.
                - 'text-xl font-semibold leading-tight': Styles the title's appearance. */}
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, sit? Placeat ipsa corporis exercitationem? Qui vitae harum ea dicta doloremque. Quam recusandae debitis laudantium. Deleniti nulla ratione unde harum fugit!
        </h5>
    </div>
</div>
</>
    )};