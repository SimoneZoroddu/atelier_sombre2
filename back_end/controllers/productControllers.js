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
                shoe.image = imagesResults.find(image => image.shoe_id === shoe.id);
            });

            res.json(finalResults);
        });
    });
};

//Show Routes items by genre
const showByGenre = (req, res, next) => {
    const genre = req.params.genre;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;

    const queryCount = 'SELECT COUNT(*) AS total FROM shoes WHERE genre = ?';

    connection.query(queryCount, [genre], (err, countResults) => {
        if (err) return res.status(500).json({ error: 'Errore nel conteggio' });

        const totalResults = countResults[0].total;

        const queryShoes = 'SELECT * FROM shoes WHERE genre = ? ORDER BY created_at DESC LIMIT ? OFFSET ?';

        connection.query(queryShoes, [genre, limit, offset], (err, shoesResults) => {
            if (err) return res.status(500).json({ error: 'Errore nel recupero scarpe' });

            if (shoesResults.length === 0) {
                return res.json({ results: [], total_results: 0 });
            }

            const shoeIds = shoesResults.map(shoe => shoe.id);
            const queryImages = 'SELECT * FROM image WHERE shoe_id IN (?)';

            connection.query(queryImages, [shoeIds], (err, imagesResults) => {
                if (err) return res.status(500).json({ error: 'Errore immagini' });

                shoesResults.forEach(shoe => {
                    shoe.image = imagesResults.find(img => img.shoe_id === shoe.id) || null;
                });

                res.json({
                    current_page: page,
                    limit: limit,
                    total_pages: Math.ceil(totalResults / limit),
                    total_results: totalResults,
                    results: shoesResults
                });
            });
        });
    });
}

// Show discouted shoes
const showDiscounted = (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;

    const queryShoes = 'SELECT * FROM shoes WHERE on_sale > 0 ORDER BY on_sale DESC LIMIT ? OFFSET ?';
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

        const queryPages = 'SELECT COUNT(*) AS total FROM shoes WHERE on_sale > 0';

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
                shoe.image = imagesResults.find(image => image.shoe_id === shoe.id);
            });

            res.json(finalResults);
        });
    });
};


// Show Routes single item
const show = (req, res, next) => {
    //use params :NAME and : COLOR instead of ID in url
    const slugShoeName = req.params.name;
    const slugColor = req.params.color;

    const queryShoes = `
        SELECT * FROM shoes 
        WHERE LOWER(REPLACE(name, ' ', '-')) = ? 
        AND LOWER(REPLACE(color, ' ', '-')) = ?`;
    //get single item
    connection.query(queryShoes, [slugShoeName, slugColor], (err, shoesResults) => {
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

            const queryQty = 'SELECT * FROM shoes_variant WHERE shoe_id = ?';
            //get quantity
            connection.query(queryQty, id, (err, qtyResults) => {
                if (err) {
                    console.error('Errore nella query quantity:', err);
                    return res.status(500).json({ error: 'Errore interno' });
                }
                finalResults[0].quantity = qtyResults;
                // console.log(finalResults[0]);

                res.json(finalResults[0]);
            });

        });
    });
}

const showByCategory = (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;
    const category = req.params.category;


    const queryShoes = 'SELECT * FROM shoes WHERE category = ? LIMIT ? OFFSET ?';
    // Get from DB all shoes
    connection.query(queryShoes, [category, limit, offset], (err, shoesResults) => {
        if (err) {
            console.error('Errore nella query shoes:', err);
            return res.status(500).json({ error: 'Errore interno (Shoes)' });
        }

        if (!shoesResults) {
            return res.json(['nessun risultato']);
        }

        const finalResults = { results: shoesResults, };

        const queryPages = 'SELECT COUNT(*) AS total FROM shoes WHERE category = ?';
        connection.query(queryPages, [category], (err, pagesResults) => {
            if (err) {
                console.error('Errore nella query pages:', err);
                return res.status(500).json({ error: 'Errore interno (Pages)' });
            }

            finalResults.current_page = page;
            finalResults.limit = limit;
            finalResults.total_pages = Math.ceil(pagesResults[0].total / limit);
            finalResults.total_results = pagesResults[0].total;
        });

        const queryImages = 'SELECT * FROM image';
        connection.query(queryImages, (err, imagesResults) => {
            if (err) {
                console.error('Errore nella query images:', err);
                return res.status(500).json({ error: 'Errore interno (Images)' });
            }
            //merge shoes and images
            finalResults.results.forEach(shoe => {
                shoe.image = imagesResults.find(image => image.shoe_id === shoe.id);
            });

            res.json(finalResults);
            console.log(finalResults);
        });
    });
}

module.exports = { index, showByGenre, showDiscounted, showByCategory, show };