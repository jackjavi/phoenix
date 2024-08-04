$(document).ready(function() {
    function addTagFunctionality() {
        $('.add-tag').on('click', function(e) {
            e.preventDefault();
            var $dropdown = $(this).closest('.dropdown-menu');
            var $submenu = $dropdown.find('.dropdown-submenu');
            $submenu.toggle();
        });

        $('.tag-option').on('click', function(e) {
            e.preventDefault();
            var tag = $(this).data('tag');
            var $cardBody = $(this).closest('.card-body');
            var $badgeContainer = $cardBody.find('.badge-container');

            var tagClass = '';
            switch (tag) {
                case 'Datacenter':
                case 'HelpDesk':
                case 'Microsoft':
                case 'System':
                case 'Developer':
                    tagClass = 'badge-phoenix-info';
                    break;
                case 'VMware':
                case 'Database':
                case 'Linux':
                    tagClass = 'badge-phoenix-warning';
                    break;
                case 'Backup':
                case 'Trading':
                case 'Network':
                    tagClass = 'badge-phoenix-danger';
                    break;
                case 'Security':
                    tagClass = 'badge-phoenix-primary';
                    break;
            }

            // Check if the tag already exists
            if ($badgeContainer.find(`[data-tag="${tag}"]`).length === 0) {
                $badgeContainer.append(`
                    <h6 class="badge badge-phoenix fs-10 ${tagClass}" data-tag="${tag}">
                        ${tag} <input type="checkbox" class="remove-tag" style="display: none;">
                    </h6>
                `);
            }
            
            // remove the tag option, if its not checked.
            $('.remove-tag').on('change', function() {
                if ($(this).is(':checked')) {
                    $(this).closest('h6').remove();
                }
            });
        });
    }

    addTagFunctionality();
});