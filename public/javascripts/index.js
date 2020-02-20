//adds user tooltip hover functionality 
const showTooltipsOnHover = () => {
    $('.identity-card-container').on('mouseover', '.identity-card', function(){
        $(this).parent().parent().parent().find('.tooltips').show();
    }).mouseleave(function() {
        $(this).parent().parent().parent().find('.tooltips').hide();
    })
}

//Handles pagination, including prev/next buttons and the browser back/forward
const handlePagination = (page) => {
    pushState();
    window.onpopstate = function(e){
        if (e.state && page > e.state.page) {
            page = e.state.page--;
        } else if (e.state && page < e.state.page) {
            page = e.state.page++;
        }
        document.getElementById('Projects').innerHTML = e.state.projectsHtml;
        document.getElementById('Pagination').innerHTML = e.state.paginationHtml;
        document.getElementById('Headline').innerHTML = e.state.headlineHtml;
        document.getElementById('Tooltips').innerHTML = e.state.tooltipsHtml;
        showTooltipsOnHover();
    };

    $('#Pagination').on('click', '.grey-gold-button', {}, function() {
        const target = $(this).text();
        (target === 'Next >') ? page++ : page--;

        ajaxProjectsPageRequest(page);
    })
}

const pushState = (path = '', page) => {
    window.history.pushState({
        projectsHtml: document.getElementById('Projects').innerHTML, 
        paginationHtml: document.getElementById('Pagination').innerHTML,
        headlineHtml: document.getElementById('Headline').innerHTML, 
        tooltipsHtml: document.getElementById('Tooltips').innerHTML,
        page: page
    }, 'Title', path);
}

const ajaxProjectsPageRequest = (page) => {
    $.ajax({
        type: 'GET',
        url: `/ajax/projects/${page}`,
        success: function(data) {
            const {projects, currentPage, totalPages, usersData} = data;

            projects.forEach((project, index) => {
                const user = usersData[project.owner_id];
                renderProjects(project, user, index);
                renderHeadline(project, user, index);
                renderTooltips(user, index);
                renderPaginationButtons(currentPage, totalPages);
            })
            showTooltipsOnHover();
            pushState(`/projects/${data.page}`, page);
        }
    })
}

//dyunamically renders project data on page
const renderProjects = (project, user, index) => {
    let imageUrl = project.image_url || '/images/placeholder.png';
    $(`.project-${index}`).attr('href', `/project/${project.id}`).html(`
        <div class="project-item-cover">
            <img src="${imageUrl}">
        </div>
        <div class="project-item-stats">
            <span class="action-view-count" title="View Count">
                <div class="icon icon-eye">
                    <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M8.014 12.122c4.036 0 7.002-4.146 7.002-4.146S11.694 3.83 8.014 3.83c-3.68 0-7.002 4.146-7.002 4.146s2.965 4.146 7.002 4.146zm0-1.572a2.573 2.573 0 1 0-.002-5.146 2.573 2.573 0 0 0 .002 5.146zm0-1a1.573 1.573 0 0 0 0-3.146 1.572 1.572 0 0 0 0 3.145z" fill-rule="evenodd"></path></svg>
                </div>
                ${project.views}
            </span>
            <span class="action-view" title="Followers">
                <div class="icon icon-users">
                    <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M9.48 10.79c.347-.278.478-.604.478-1.068 0-.496-.396-.335-.57-1.243-.073-.378-.423-.007-.49-.868 0-.343.19-.428.19-.428s-.096-.507-.134-.898c-.047-.486.29-1.743 2.094-1.743 1.802 0 2.14 1.257 2.093 1.743-.037.39-.134.898-.134.898s.19.085.19.428c-.066.86-.416.49-.49.867-.173.908-.57.746-.57 1.242 0 .826.416 1.212 1.715 1.67 1.303.46 2.15.927 2.15 1.246v1.072H0v-1.34c0-.4 1.042-.984 2.645-1.558 1.6-.572 2.11-1.054 2.11-2.087 0-.62-.488-.418-.703-1.554-.09-.47-.52-.006-.602-1.082 0-.43.235-.535.235-.535s-.12-.634-.166-1.123c-.06-.608.357-2.18 2.575-2.18 2.22 0 2.635 1.572 2.577 2.18-.047.49-.167 1.123-.167 1.123s.235.106.235.535c-.082 1.076-.513.612-.602 1.083-.214 1.137-.702.934-.702 1.555 0 1.02.497 1.502 2.045 2.064z" fill-rule="evenodd"></path></svg>
                </div>
                ${project.followers}
            </span>
            <span class="action-skull" title="Likes">
                <div class="icon icon-skull">
                    <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M5.508 5.892l.583-.582-.68-.627c-.522-.48-.703-.753-.77-1.166a1.694 1.694 0 0 0-1.41-1.395l-.544-.076.524.503.524.5-.51.577c-.28.317-.558.63-.618.7-.062.067-.3-.04-.542-.242-.238-.2-.48-.364-.54-.364-.234 0 .048.726.432 1.11.32.318.53.407.98.41.484 0 .686.1 1.264.613.38.336.697.614.707.617.01.003.28-.257.6-.578zm6.173.045c.635-.55.877-.676 1.292-.675a1.59 1.59 0 0 0 1.49-1.07c.09-.27.136-.514.106-.545-.03-.03-.286.134-.567.365l-.51.42-.606-.665-.607-.665.505-.535.506-.534-.544.083c-.71.108-1.296.69-1.41 1.402-.07.423-.25.688-.826 1.215l-.737.673.52.59c.286.325.54.597.565.604.025.007.396-.29.826-.663zm-2.137 3.52c-.06-.103-.29-.273-.51-.38-.603-.29-.745-.598-.434-.94.376-.418 1.082-.38 1.442.078.34.433.36.71.07 1.12-.244.352-.412.387-.57.12zm-3.82-.12c-.288-.41-.27-.69.07-1.122.36-.457 1.066-.496 1.444-.08.31.344.168.653-.433.943-.22.106-.45.276-.51.378-.158.266-.326.23-.57-.12zm1.85 1.21c0-.378.278-.927.44-.873.194.064.41.78.295.97-.045.072-.138.047-.21-.058-.103-.145-.148-.148-.202-.014-.096.235-.322.217-.322-.026zm-.275.997c0-.24.253-.306.23-.016-.012.18-.015.638.528.655.542.017.49-.384.493-.572.002-.36.246-.28.246.012 0 .296.22.545.6.547.38 0 .38-.323.38-.624 0-.252.146-.59.366-.85.535-.636.736-1.22.736-2.135 0-2.387-2.244-3.872-4.32-2.857-1.917.94-2.3 3.69-.72 5.168.198.184.36.466.36.627.01.535.12.67.554.676.435.007.445-.366.546-.63zm5.458 2.057l-.51-.447.567-.654c.31-.36.634-.655.72-.655.084 0 .326.166.538.37.463.442.627.344.39-.23-.277-.666-.894-1.104-1.556-1.104-.47 0-.662-.09-1.108-.515-.323-.31-.563-.45-.6-.353-.032.09-.236.408-.453.706l-.394.544.47.456c.26.25.47.56.47.684 0 .857.754 1.645 1.573 1.646h.402l-.51-.447zm-8.896.24c.443-.23.822-.842.822-1.327 0-.17.195-.51.432-.756l.432-.446-.328-.402c-.18-.222-.4-.52-.487-.662-.148-.246-.18-.237-.618.17-.346.324-.63.45-1.133.503-.77.08-1.256.47-1.456 1.17-.153.533-.03.563.404.1.178-.19.4-.345.494-.345.094 0 .43.294.747.654l.574.653-.518.448-.518.448h.375c.205 0 .555-.094.777-.21z" fill-rule="evenodd"></path></svg>
                </div>
                ${project.skulls}
            </span>
        </div>
    `)
}

//dyunamically renders project info data on page
const renderHeadline = (project, user, index) => {
    $(`.headline-${index}`).html(`
        <h3 class="element-title">
            <a href="/project/${project.id}">${project.name}</a>
        </h3>
        <p class="identity-card-container">
            <span class="identity-card" data-id="106066">
                <a href="#"><img src="${user.image_url}" >${user.screen_name}</a>
            </span>
        </p>
    `)
}

//tooltip data that is rendered on hover
const renderTooltips = (user, index) => {
    $(`.tooltip-${index}`).html(`
            <div class="user-pic">
                <img src="${user.image_url}" >
            </div>
            <div>
                <div class="username">
                    ${user.screen_name}
                </div>
                <p class="about-me">
                    ${user.about_me}
                </p>
                <div class="followers-projects-container">
                    <div>
                        <b>${user.followers}</b> Followers
                    </div>
                    <div>
                        <b>${user.projects}</b> Projects
                </div>
            </div>
        </div>
    `)
}

//renders the next, prev, or both buttons depending on the page# and total# of pages
const renderPaginationButtons = (currentPage, totalPages) => {
    let paginationHtml = '';
    if (currentPage == 1 && totalPages > 1) {
        paginationHtml = '<button class="grey-gold-button next-button">Next ></button>';
    } else if (currentPage < totalPages) {
        paginationHtml = `<button class="grey-gold-button prev-button">< Prev</button>
                            <button class="grey-gold-button next-button">Next ></button>`
    } else if (currentPage == totalPages && totalPages > 1) {
        paginationHtml = `<button class="grey-gold-button prev-button">< Prev</button>`
    }

    $('#Pagination').html(paginationHtml);
}

/* Would allow us to only request tooltip data once per browsing session */

// const setSessionStorage = () => {
//     let usersData = JSON.parse(sessionStorage.getItem('usersData'));
//     if (!usersData) {
//         usersData = "<%= usersData %>";
//         sessionStorage.setItem('usersData', JSON.stringify(usersData));
//     }
//     return JSON.parse(sessionStorage.getItem('usersData'))];
// });

