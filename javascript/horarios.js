document.addEventListener('DOMContentLoaded', function() {
    // Elementos dos filtros
    const cursoFilter = document.getElementById('curso');
    const anoFilter = document.getElementById('ano');
    
    // Todos os cards de curso
    const todosCursos = document.querySelectorAll('.curso-card');
    
    // Inicializar - expandir primeiro curso por padrão
    if (todosCursos.length > 0) {
        toggleCurso(todosCursos[0]);
    }

    // Função para expandir/recolher cursos
    function toggleCurso(cursoCard) {
        const isExpanded = cursoCard.classList.contains('expanded');
        const btn = cursoCard.querySelector('.btn-expand');
        
        // Recolher todos os cursos primeiro
        document.querySelectorAll('.curso-card.expanded').forEach(card => {
            if (card !== cursoCard) {
                card.classList.remove('expanded');
                card.querySelector('.btn-expand').textContent = 'Expandir';
            }
        });
        
        // Alternar estado do curso clicado
        if (!isExpanded) {
            cursoCard.classList.add('expanded');
            btn.textContent = 'Recolher';
            
            // Animar a abertura
            const anosContainer = cursoCard.querySelector('.anos-container');
            anosContainer.style.animation = 'fadeIn 0.5s ease-out';
        } else {
            cursoCard.classList.remove('expanded');
            btn.textContent = 'Expandir';
        }
        
        // Reaplicar filtros após toggle
        aplicarFiltros();
    }

    // Event listeners para botões expandir
    document.querySelectorAll('.btn-expand').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Impedir que clique no botão dispare o evento do header
            const cursoCard = this.closest('.curso-card');
            toggleCurso(cursoCard);
        });
    });

    // Event listener para clicar no header do curso
    document.querySelectorAll('.curso-header').forEach(header => {
        header.addEventListener('click', function() {
            const cursoCard = this.closest('.curso-card');
            toggleCurso(cursoCard);
        });
    });

    // Sistema de upload de imagens
    document.querySelectorAll('.file-input').forEach(input => {
        input.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                const placeholder = this.closest('.horario-placeholder');
                
                reader.onload = function(e) {
                    // Criar elemento de imagem
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.className = 'horario-image';
                    img.alt = 'Horário do curso';
                    
                    // Limpar placeholder e adicionar imagem
                    placeholder.innerHTML = '';
                    placeholder.appendChild(img);
                    placeholder.classList.add('has-image');
                    
                    // Adicionar animação de entrada
                    img.style.animation = 'scaleIn 0.5s ease-out';
                    
                    // Adicionar botão de remover
                    const removeBtn = document.createElement('button');
                    removeBtn.className = 'btn-remove';
                    removeBtn.innerHTML = '🗑️';
                    removeBtn.title = 'Remover imagem';
                    removeBtn.style.cssText = `
                        position: absolute;
                        top: 5px;
                        right: 5px;
                        background: rgba(255,0,0,0.8);
                        border: none;
                        border-radius: 50%;
                        width: 30px;
                        height: 30px;
                        color: white;
                        cursor: pointer;
                        font-size: 12px;
                        z-index: 10;
                    `;
                    
                    removeBtn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        resetPlaceholder(placeholder);
                    });
                    
                    placeholder.appendChild(removeBtn);
                    placeholder.style.position = 'relative';
                };
                
                reader.readAsDataURL(file);
            } else {
                alert('Por favor, selecione um arquivo de imagem válido.');
            }
        });
    });

    // Função para resetar o placeholder
    function resetPlaceholder(placeholder) {
        placeholder.innerHTML = `
            <div class="placeholder-icon">📷</div>
            <p>Clique para adicionar imagem do horário</p>
            <input type="file" class="file-input" accept="image/*">
        `;
        placeholder.classList.remove('has-image');
        
        // Re-adicionar event listener ao novo input
        const newInput = placeholder.querySelector('.file-input');
        newInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.className = 'horario-image';
                    img.alt = 'Horário do curso';
                    
                    placeholder.innerHTML = '';
                    placeholder.appendChild(img);
                    placeholder.classList.add('has-image');
                    img.style.animation = 'scaleIn 0.5s ease-out';
                    
                    const removeBtn = document.createElement('button');
                    removeBtn.className = 'btn-remove';
                    removeBtn.innerHTML = '🗑️';
                    removeBtn.title = 'Remover imagem';
                    removeBtn.style.cssText = `
                        position: absolute;
                        top: 5px;
                        right: 5px;
                        background: rgba(255,0,0,0.8);
                        border: none;
                        border-radius: 50%;
                        width: 30px;
                        height: 30px;
                        color: white;
                        cursor: pointer;
                        font-size: 12px;
                        z-index: 10;
                    `;
                    
                    removeBtn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        resetPlaceholder(placeholder);
                    });
                    
                    placeholder.appendChild(removeBtn);
                    placeholder.style.position = 'relative';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Sistema de filtros
    function aplicarFiltros() {
        const cursoSelecionado = cursoFilter.value;
        const anoSelecionado = anoFilter.value;
        
        todosCursos.forEach(card => {
            const curso = card.dataset.curso;
            let mostrarCurso = true;
            
            // Filtrar por curso
            if (cursoSelecionado !== 'todos' && curso !== cursoSelecionado) {
                mostrarCurso = false;
                card.classList.add('hidden');
            } else {
                card.classList.remove('hidden');
                
                // Filtrar anos dentro do curso
                if (anoSelecionado !== 'todos' && card.classList.contains('expanded')) {
                    const anosSections = card.querySelectorAll('.ano-section');
                    let temAnoVisivel = false;
                    
                    anosSections.forEach(section => {
                        if (section.dataset.ano === anoSelecionado) {
                            section.classList.remove('hidden');
                            temAnoVisivel = true;
                        } else {
                            section.classList.add('hidden');
                        }
                    });
                    
                    // Se não tem o ano filtrado, esconder o curso
                    if (!temAnoVisivel) {
                        card.classList.add('filtered-out');
                    } else {
                        card.classList.remove('filtered-out');
                    }
                } else {
                    // Mostrar todos os anos
                    card.querySelectorAll('.ano-section').forEach(section => {
                        section.classList.remove('hidden');
                    });
                    card.classList.remove('filtered-out');
                }
            }
        });
    }

    // Event listeners para filtros
    cursoFilter.addEventListener('change', aplicarFiltros);
    anoFilter.addEventListener('change', aplicarFiltros);

    // Animar elementos ao carregar a página
    setTimeout(() => {
        todosCursos.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
    }, 100);
});