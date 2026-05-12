const connection = require('../data/data');
//Index Routes Shoes
const index = (req, res, next) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || req.query.limit || 12;
    const offset = (page - 1) * limit;

    const queryShoes = 'SELECT * FROM shoes ORDER BY created_at DESC LIMIT ? OFFSET ?';
    // Get from DB all shoes
    connection.query(queryShoes, [limit, offset], (err, shoesResults) => {
        if (err) {
            console.error('Errore nella query shoes:', err);
            return res.status(500).json({ error: 'Errore interno (Shoes)' });
        }

        if (!shoesResults) {
            return res.json(['nessun risultato']);
        }

        const finalResults = { results: shoesResults, };

        const queryPages = 'SELECT COUNT(*) AS total FROM shoes';

        connection.query(queryPages, (err, pagesResults) => {
            if (err) {
                console.error('Errore nella query pages:', err);
                return res.status(500).json({ error: 'Errore interno (Pages)' });
            }

            finalResults.current_page = page;
            finalResults.limit = limit;
            finalResults.total_pages = Math.ceil(pagesResults[0].total / limit);
            finalResults.total_results = pagesResults[0].total;
        });


        //get all images
        const queryImages = 'SELECT * FROM image';

        connection.query(queryImages, (err, imagesResults) => {
            if (err) {
                console.error('Errore nella query images:', err);
                return res.status(500).json({ error: 'Errore interno' });
            }
            //merge shoes and images
            finalResults.results.forEach(shoe => {
                shoe.images = imagesResults.find(image => image.shoe_id === shoe.id);
            });

            res.json(finalResults);
        });
    });
};

//Show Routes items by genre
const showByGenre = (req, res, next) => {
    const genre = req.params.genre;
    const queryShoes = 'SELECT * FROM shoes WHERE genre = ?';
    //get shoes by genre
    connection.query(queryShoes, [genre], (err, shoesResults) => {
        if (err) {
            console.error('Errore nella query shoes:', err);
            return res.status(500).json({ error: 'Errore interno' });
        }

        if (!shoesResults) {
            return res.json(['nessun risultato']);
        }

        const finalResults = { results: shoesResults, };
        console.log(finalResults);
        //get all images
        const queryImages = 'SELECT * FROM image';

        connection.query(queryImages, (err, imagesResults) => {
            if (err) {
                console.error('Errore nella query images:', err);
                return res.status(500).json({ error: 'Errore interno' });
            }
            //merge shoes and images
            finalResults.results.forEach(shoe => {
                shoe.images = imagesResults.filter(image => image.shoe_id === shoe.id);
            });

            res.json(finalResults);
        });
    });
}



// Show Routes single item
const show = (req, res, next) => {
    //use params :NAME and : COLOR instead of ID in url
    const shoeName = req.params.name;
    const color = req.params.color;
    const queryShoes = 'SELECT * FROM shoes WHERE name = ? AND color = ?';
    //get single item
    connection.query(queryShoes, [shoeName, color], (err, shoesResults) => {
        if (err) {
            console.error('Errore nella query shoes:', err);
            return res.status(500).json({ error: 'Errore interno' });
        }

        if (!shoesResults) {
            return res.status(404).json({ error: 'Prodotto non trovato' });
        }

        const id = shoesResults[0].id;

        //get images
        const queryImages = 'SELECT * FROM image';
        connection.query(queryImages, (err, imagesResults) => {
            if (err) {
                console.error('Errore nella query images:', err);
                return res.status(500).json({ error: 'Errore interno' });
            }
            //merge shoes and images
            const finalResults = shoesResults.map(shoe => {
                const shoeImage = imagesResults.find(img => img.shoe_id === shoe.id);
                return {
                    ...shoe,
                    image: {
                        main_image_url: shoeImage.main_image_url,
                        top_view_url: shoeImage.top_view_url,
                        secondary_image_url: shoeImage.secondary_image_url,
                        model_image_url: shoeImage.model_image_url
                    }
                };
            })

            const queryQty = 'SELECT id, size, stock FROM shoes_variant WHERE shoe_id = ?';
            //get quantity
            connection.query(queryQty, id, (err, qtyResults) => {
                if (err) {
                    console.error('Errore nella query quantity:', err);
                    return res.status(500).json({ error: 'Errore interno' });
                }
                finalResults[0].quantity = qtyResults;

                res.json(finalResults[0]);
            });

        });
    });
}

module.exports = { index, showByGenre, show };