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
// [美化版] 渲染论文列表 (生成卡片结构)
function renderPapers(papers, container) {
    container.innerHTML = ''; 

    // 创建容器
    const ul = document.createElement('ul');
    ul.className = 'scholar-list'; 

    papers.forEach(p => {
        const li = document.createElement('li');
        li.className = 'scholar-item'; 
        
        // 1. 论文标题 (链接)
        const titleHtml = `
            <a href="${p.link}" target="_blank" class="scholar-title">
                ${p.title}
                <i class="bi bi-box-arrow-up-right external-icon"></i>
            </a>`;
        
        // 2. 元数据区域 (年份 + 引用)
        let metaHtml = `<div class="scholar-meta">`;
        
        // 年份标签
        if (p.year && p.year !== "0") {
            metaHtml += `<span class="scholar-badge year"><i class="bi bi-calendar-event"></i> ${p.year}</span>`;
        }
        
        // 引用标签 (高亮显示)
        if (p.citation > 0) {
            metaHtml += `<span class="scholar-badge citation"><i class="bi bi-star-fill"></i> Cited by <strong>${p.citation}</strong></span>`;
        }
        
        metaHtml += `</div>`;

        li.innerHTML = titleHtml + metaHtml;
        ul.appendChild(li);
    });

    container.appendChild(ul);
}
