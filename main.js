const file_input = document.getElementById('file');
const image_preview = document.getElementById("image_preview");
const show_exif = document.getElementById("show_exif");
const save_image = document.getElementById("save_image");
const canvas = document.getElementById("canvas");
const wait = document.getElementById("wait");

function clickRealBtn() {   
    // Click real file input button
    file_input.click();
}

function previewImage() {
    image_preview.innerHTML = ""; // Clear
    // Show loading gif
    image_preview.innerHTML = "<img " + "src='loading.gif'" + " alt='https://icons8.com/preloaders/en/circular/fading-lines/' />" 
    
    let fReader = new FileReader();
    let img = new Image();

    img.onload = () => {        // Show preview
        image_preview.innerHTML = '' // Clear loading gif
        image_preview.innerHTML = '<img style="max-width: 200px; max-height: 300px"' + 'src="' + img.src + '"' + "/>"
    }

    fReader.onloadend = e => {img.src = e.target.result;};
    fReader.readAsDataURL(file_input.files[0]);
}

function getExif() {
    let fReader = new FileReader();
    let img = new Image();

    show_exif.innerHTML = ""; // clear show_exif div

    img.onload = function() {
        // Show EXIF data
        EXIF.getData(img, () => {
            let tags = Object.entries(EXIF.getAllTags(this));

            let exif_exist = false;
            tags.forEach((tag) => {
                let key = tag[0];
                let value = tag[1];
                if(
                key != 'MakerNote' &&
                key != 'UserComment' &&
                key != 'thumbnail') {
                    show_exif.innerHTML += "<small>" + key + " : " + value + "</small><br>";
                    exif_exist = true;
                }
            });

            // If exif data don't exist
            if(exif_exist != true) {
                show_exif.innerHTML = "<small>" + "EXIF data မတွေ့ပါ။" + "</small>"
            }
        });
    }

    fReader.onloadend = (e) => {
        img.src = e.target.result;
    }

    fReader.readAsDataURL(file_input.files[0]);
}

function removeExif() {
    let fReader = new FileReader();
    let raw_img = new Image();
    let img = new Image();

    raw_img.onload = () => {
        canvas.width = raw_img.width;
        canvas.height = raw_img.height;

        ctx = canvas.getContext("2d");
    
        ctx.drawImage(raw_img, 0, 0);

        img.onload = () => {
            wait.style.display = 'none';
            save_image.setAttribute("href", img.src);
            save_image.click()
        }

        img.src = canvas.toDataURL("image/png", 1);
    }

    fReader.onloadend = e => {raw_img.src = e.target.result;};
    wait.style.display = 'block';
    fReader.readAsDataURL(file_input.files[0]);
}