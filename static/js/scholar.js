// 1. 修正地址：使用 CSUFUNLAB 用户名 + master 分支
const jsonPath = 'https://cdn.jsdelivr.net/gh/CSUFUNLAB/tangfengxiao@master/static/scholar.json';

document.addEventListener("DOMContentLoaded", function() {
    console.log("🚀 Script starting... Target:", jsonPath);
    
    fetch(jsonPath)
        .then(response => {
            if (!response.ok) throw new Error("CDN Error: " + response.status);
            return response.json();
        })
        .then(data => {
            console.log("✅ Data loaded:", data);
            
            // 开始轮询，直到找到页面元素
            waitForElement('papers-list', function(container) {
                renderPapers(data.papers, container);
            });
            
            waitForElement('stats-grid', function(container) {
                renderStats(data);
            });
        })
        .catch(error => {
            console.error('❌ Error:', error);
        });
});

// 轮询函数：每500ms找一次，直到找到
function waitForElement(id, callback) {
    const interval = setInterval(() => {
        const el = document.getElementById(id);
        if (el) {
            console.log(`Element ${id} found! Rendering...`);
            clearInterval(interval);
            callback(el);
        }
    }, 500);
}

// 渲染统计
function renderStats(data) {
    const container = document.getElementById('stats-grid');
    if(!container) return;
    container.innerHTML = ''; 
    const items = [
        { label: 'Citations', value: data.citations },
        { label: 'h-index', value: data.h_index },
        { label: 'i10-index', value: data.i10_index }
    ];
    items.forEach(item => {
        if (item.value !== undefined) {
            container.innerHTML += `
                <div class="stat-card">
                    <span class="stat-number">${item.value}</span>
                    <span class="stat-label">${item.label}</span>
                </div>`;
        }
    });
}

// 渲染论文
function renderPapers(papers, container) {
    container.innerHTML = '';
    const ul = document.createElement('ul');
    ul.style.paddingLeft = '20px';
    
    papers.forEach(p => {
        const li = document.createElement('li');
        li.style.marginBottom = '10px';
        li.innerHTML = `
            <a href="${p.link}" target="_blank" style="font-weight:600;color:#000;text-decoration:none">${p.title}</a>. 
            <span style="color:#666">(${p.year})</span>.
            ${p.citation > 0 ? `<span style="color:#0056b3;font-size:0.9em">[Cited by ${p.citation}]</span>` : ''}
        `;
        ul.appendChild(li);
    });
    container.appendChild(ul);
}
