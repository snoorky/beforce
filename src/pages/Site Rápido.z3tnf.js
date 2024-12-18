import wixData from 'wix-data';
import { formFactor } from 'wix-window-frontend';

$w.onReady(async function () {
    let currentPage = 1;
    let itemsPerPage = formFactor === "Mobile" ? 3 : 6;

    $w('#webstesPagination').currentPage = 1;
    $w('#webstesPagination').onChange((event) => {
        currentPage = event.target.currentPage;
        filterWebsites(currentPage, itemsPerPage);
    });

    filterWebsites(currentPage, itemsPerPage);

    $w('#repeaterWebsites').onItemReady(($item, itemData) => {
        $item('#imgWebsites').src = itemData.image;
        $item('#imgWebsites').alt = itemData.title;
        $item('#imgWebsites').tooltip = "";
        $item('#imgWebsites').link = itemData.url;
        $item('#textWebsites').text = itemData.title;
    });
});

function filterWebsites(page, itemsPerPage) {
    wixData.query("FastWebsites")
        .limit(itemsPerPage)
        .skip((page - 1) * itemsPerPage)
        .find()
        .then((results) => {
            let totalItems = results.totalCount;
            let totalPages = Math.ceil(totalItems / itemsPerPage);

            $w('#repeaterWebsites').data = results.items;
            $w('#webstesPagination').totalPages = totalPages;
        });
}