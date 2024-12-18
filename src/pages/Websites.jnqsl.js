import wixData from 'wix-data';
import { formFactor } from 'wix-window-frontend';

$w.onReady(async function () {
    let currentPage = 1;
    let itemsPerPage = formFactor === "Mobile" ? 4 : 12;
    let selectedCategoryId = null;

    wixData.query("Categorias")
    .find()
    .then((results) => {
        let categories = results.items;
        let options = categories.map(category => {
            return {
                label: category.title,
                value: category._id
            };
            });
        $w("#dropdownFilter").options = options;
    });

    $w('#dropdownFilter').onChange(() => {
        selectedCategoryId = $w('#dropdownFilter').value;
        filterWebsites(currentPage, itemsPerPage, selectedCategoryId);
    });

    $w('#webstesPagination').currentPage = 1;
    $w('#webstesPagination').onChange((event) => {
        currentPage = event.target.currentPage;
        filterWebsites(currentPage, itemsPerPage, selectedCategoryId);
    });

    filterWebsites(currentPage, itemsPerPage, selectedCategoryId);

    $w('#repeaterWebsites').onItemReady(($item, itemData) => {
        $item('#imgWebsites').src = itemData.image;
        $item('#imgWebsites').tooltip = itemData.title;
        $item('#imgWebsites').alt = itemData.title;
        $item('#imgWebsites').link = itemData.link
        $item('#textWebsites').text = itemData.title;
    });
});

function filterWebsites(page, itemsPerPage, categoryId) {
    let query = wixData.query("Websites")
    .eq("arrayFilter", true)

    if (categoryId) {
        query = query.hasSome("multireference", [categoryId]);
    }

    query
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