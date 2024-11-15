document.addEventListener("DOMContentLoaded", () => {
    const data = {
        title: "OS Doors",
        dev: { front: 66, back: 100, db: 31 },
        test: { front: 60, back: 80, db: 31 },
        prod: { front: 66, back: 83, db: 31 },
        norm: 150,
    };

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("viewBox", "0 0 700 400");

    const scaleFactor = 1.5; // Коэффициент масштабирования
    const maxHeight = 400; // Максимальная высота для столбиков в пикселях

    const instances = ["dev", "test", "prod"];
    const colors = { front: "#4AB6E8", back: "#AA6FAC", db: "#E85498" };

    const barWidth = 80; // Ширина каждого столбика
    let xPosition = 100; // Начальная позиция по оси X
    const cornerRadius = 10;

    // Добавляем заголовок сверху
    const title = document.createElementNS(svgNS, "text");
    title.setAttribute("x", "50%");
    title.setAttribute("y", "0");
    title.setAttribute("text-anchor", "middle");
    title.setAttribute("font-size", "16");
    title.setAttribute("fill", "#898290");
    title.setAttribute("font-weight", "500");
    title.setAttribute("font-family", "Roboto");
    title.textContent = `Количество пройденных тестов "${data.title}"`;
    svg.appendChild(title);

    const totalValues = {}; // Для хранения суммарных значений для каждого инстанса
    const topPositions = {}; // Для хранения верхних позиций каждого инстанса

    // Встраиваем маркер стрелки прямо в основной SVG
    const defs = document.createElementNS(svgNS, "defs");
    const marker = document.createElementNS(svgNS, "marker");
    marker.setAttribute("id", "arrow");
    marker.setAttribute("markerWidth", "10");
    marker.setAttribute("markerHeight", "10");
    marker.setAttribute("refX", "5");
    marker.setAttribute("refY", "5");
    marker.setAttribute("orient", "auto");
    marker.setAttribute("markerUnits", "strokeWidth");
    
    const arrowPath = document.createElementNS(svgNS, "path");
    arrowPath.setAttribute("d", "M0,0 L10,5 L0,10 L2,5 Z");
    arrowPath.setAttribute("fill", "#898290");
    marker.appendChild(arrowPath);
    defs.appendChild(marker);
    svg.appendChild(defs);

    instances.forEach((instance) => {

        let total = 0; // Суммарное значение для инстанса

        const components = ["front", "back", "db"];
        components.forEach((component) => {
            total += data[instance][component];
        });
        const totalHeight = total * scaleFactor;

        // Создаем линейный градиент для основного столбца
        const gradientId = `gradient-${instance}`;
        const gradient = document.createElementNS(svgNS, "linearGradient");
        gradient.setAttribute("id", gradientId);
        gradient.setAttribute("x1", "0%");
        gradient.setAttribute("y1", "0%");
        gradient.setAttribute("x2", "0%");
        gradient.setAttribute("y2", "100%");

        // Определяем пропорции для каждого компонента
        let offset = 0;
        components.forEach((component) => {
            const value = data[instance][component];
            const heightPercent = (value / total) * 100; // Доля компонента в процентах

            // Начальная точка сегмента
            const stopStart = document.createElementNS(svgNS, "stop");
            stopStart.setAttribute("offset", `${offset}%`);
            stopStart.setAttribute("stop-color", colors[component]);
            gradient.appendChild(stopStart);

            // Конечная точка сегмента
            offset += heightPercent;
            const stopEnd = document.createElementNS(svgNS, "stop");
            stopEnd.setAttribute("offset", `${offset}%`);
            stopEnd.setAttribute("stop-color", colors[component]);
            gradient.appendChild(stopEnd);
        });

        // Добавляем градиент в SVG
        const defs = document.createElementNS(svgNS, "defs");
        defs.appendChild(gradient);
        svg.appendChild(defs);

        // Создаем основной столбец с закругленными углами и применяем градиент
        const mainRect = document.createElementNS(svgNS, "rect");
        mainRect.setAttribute("x", xPosition);
        mainRect.setAttribute("y", maxHeight - totalHeight);
        mainRect.setAttribute("width", barWidth);
        mainRect.setAttribute("height", totalHeight);
        mainRect.setAttribute("fill", `url(#${gradientId})`);
        mainRect.setAttribute("rx", cornerRadius);
        mainRect.setAttribute("ry", cornerRadius);
        svg.appendChild(mainRect);

        topPositions[instance] = maxHeight - totalHeight;

        // Добавляем текстовые метки на каждый цветной сегмент
        let currentYPosition = maxHeight - totalHeight;
        components.forEach((component) => {
            const value = data[instance][component];
            const segmentHeight = value * scaleFactor;

            // Позиция для текста на каждом сегменте
            const text = document.createElementNS(svgNS, "text");
            text.setAttribute("x", xPosition + barWidth / 2);
            text.setAttribute("y", currentYPosition + segmentHeight / 2 + 5);
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("fill", "white");
            text.setAttribute("font-size", "14");
            text.setAttribute("font-weight", "700");
            text.setAttribute("font-family", "Roboto");
            text.textContent = value;
            svg.appendChild(text);

            currentYPosition += segmentHeight;
        });

        totalValues[instance] = total

        // Подпись для каждого инстанса
        const label = document.createElementNS(svgNS, "text");
        label.setAttribute("x", xPosition + barWidth / 2);
        label.setAttribute("y", maxHeight + 20);
        label.textContent = instance;
        label.setAttribute("font-size", "10");
        label.setAttribute("fill", "#898290");
        label.setAttribute("font-weight", "400");
        label.setAttribute("font-family", "Roboto");
        label.classList.add("label");
        svg.appendChild(label);

        xPosition += 150;
    });

    // Добавляем узор в полоску для столбца norm
    const pattern = document.createElementNS(svgNS, "pattern");
    pattern.setAttribute("id", "stripePattern");
    pattern.setAttribute("width", "10");
    pattern.setAttribute("height", "10");
    pattern.setAttribute("patternUnits", "userSpaceOnUse");
    pattern.setAttribute("patternTransform", "rotate(45)");
        
    const rect1 = document.createElementNS(svgNS, "rect");
    rect1.setAttribute("width", "10");
    rect1.setAttribute("height", "10");
    rect1.setAttribute("fill", "white");
    pattern.appendChild(rect1);
    
    const rect2 = document.createElementNS(svgNS, "rect");
    rect2.setAttribute("width", "5");
    rect2.setAttribute("height", "10");
    rect2.setAttribute("fill", "#4AB6E8");
    pattern.appendChild(rect2);

    svg.appendChild(pattern);

    // Столбец для norm
    const normHeight = data.norm * scaleFactor;
    const normRect = document.createElementNS(svgNS, "rect");
    normRect.setAttribute("x", xPosition);
    normRect.setAttribute("y", maxHeight - normHeight);
    normRect.setAttribute("width", barWidth);
    normRect.setAttribute("height", normHeight);
    normRect.setAttribute("fill", "url(#stripePattern)");
    normRect.setAttribute("rx", cornerRadius);
    normRect.setAttribute("ry", cornerRadius);
    svg.appendChild(normRect);

    // Добавляем текст с значением norm по центру столбца
    const normTextBg = document.createElementNS(svgNS, "rect");
    normTextBg.setAttribute("x", xPosition + barWidth / 2 - 20);
    normTextBg.setAttribute("y", maxHeight - normHeight - 10 + normHeight / 2);
    normTextBg.setAttribute("width", "40");
    normTextBg.setAttribute("height", "30");
    normTextBg.setAttribute("fill", "white");
    normTextBg.setAttribute("rx", "5");
    svg.appendChild(normTextBg);

    const normText = document.createElementNS(svgNS, "text");
    normText.setAttribute("x", xPosition + barWidth / 2);
    normText.setAttribute("y", maxHeight - normHeight + 10 + normHeight / 2);
    normText.setAttribute("text-anchor", "middle");
    normText.setAttribute("fill", "#898290");
    normText.setAttribute("font-size", "14");
    normText.setAttribute("font-weight", "700");
    normText.setAttribute("font-family", "Roboto");
    normText.textContent = data.norm;
    svg.appendChild(normText);

    // Подпись для norm
    const normLabel = document.createElementNS(svgNS, "text");
    normLabel.setAttribute("x", xPosition + barWidth / 2);
    normLabel.setAttribute("y", maxHeight + 20);
    normLabel.textContent = "норматив";
    normLabel.classList.add("label");
    normLabel.setAttribute("font-size", "10");
    normLabel.setAttribute("fill", "#898290");
    normLabel.setAttribute("font-weight", "400");
    normLabel.setAttribute("font-family", "Roboto");
    svg.appendChild(normLabel);

    // Функция для добавления многошаговой стрелки между столбцами
    function addArrow(x1, y1, x2, y2, diff, offsetX = 0) {
        const fixedYLevel = 50;
        const gap = 10; 

        // Вертикальный сегмент стрелки вверх
        const verticalLine1 = document.createElementNS(svgNS, "line");
        verticalLine1.setAttribute("x1", x1);
        verticalLine1.setAttribute("y1", y1 - gap);
        verticalLine1.setAttribute("x2", x1);
        verticalLine1.setAttribute("y2", fixedYLevel);
        verticalLine1.setAttribute("stroke", "#898290");
        verticalLine1.setAttribute("stroke-width", "1");
        svg.appendChild(verticalLine1);

        // Горизонтальный сегмент стрелки вправо
        const horizontalLine = document.createElementNS(svgNS, "line");
        horizontalLine.setAttribute("x1", x1);
        horizontalLine.setAttribute("y1", fixedYLevel);
        horizontalLine.setAttribute("x2", x2 + offsetX);
        horizontalLine.setAttribute("y2", fixedYLevel);
        horizontalLine.setAttribute("stroke", "#898290");
        horizontalLine.setAttribute("stroke-width", "1");
        svg.appendChild(horizontalLine);

        // Вертикальный сегмент стрелки вниз
        const verticalLine2 = document.createElementNS(svgNS, "line");
        verticalLine2.setAttribute("x1", x2 + offsetX);
        verticalLine2.setAttribute("y1", fixedYLevel);
        verticalLine2.setAttribute("x2", x2 + offsetX);
        verticalLine2.setAttribute("y2", y2 - gap);
        verticalLine2.setAttribute("stroke", "#898290");
        verticalLine2.setAttribute("stroke-width", "1");
        verticalLine2.setAttribute("marker-end", "url(#arrow)");
        svg.appendChild(verticalLine2);

        const textBg = document.createElementNS(svgNS, "rect");
        const textWidth = 48;
        const textHeight = 24;
        textBg.setAttribute("x", (x1 + x2 + offsetX) / 2 - textWidth / 2);
        textBg.setAttribute("y", fixedYLevel - textHeight / 2 - 2);
        textBg.setAttribute("width", textWidth);
        textBg.setAttribute("height", textHeight);
        textBg.setAttribute("fill", diff > 0 ? "#00CC99" : "#FC440F");
        textBg.setAttribute("rx", "15");
        svg.appendChild(textBg);

        // Текст для отображения разницы над горизонтальным сегментом стрелки
        const text = document.createElementNS(svgNS, "text");
        text.setAttribute("x", (x1 + x2 + offsetX) / 2);
        text.setAttribute("y", fixedYLevel + 5);
        text.textContent = `${diff > 0 ? '↑ +' : '↓ '}${diff}`;
        text.setAttribute("fill", "white");
        text.setAttribute("font-size", "14");
        text.setAttribute("font-weight", "700");
        text.setAttribute("font-family", "Roboto");
        text.setAttribute("text-anchor", "middle");
        svg.appendChild(text);
    }

    // Добавляем многошаговые стрелки между столбцами с небольшим смещением для вертикальных линий
    const xPositions = [100, 250, 400];
    addArrow(xPositions[0] + barWidth / 2, topPositions["dev"], xPositions[1] + barWidth / 2, topPositions["test"], totalValues["test"] - totalValues["dev"], -5); // dev -> test, сдвиг влево
    addArrow(xPositions[1] + barWidth / 2, topPositions["test"], xPositions[2] + barWidth / 2, topPositions["prod"], totalValues["prod"] - totalValues["test"], 5); // test -> prod, сдвиг вправо

    const legendXStart = 150;
    const legendYStart = maxHeight + 100;
    const legendItems = [
        { color: colors.front, label: "Клиентская часть" },
        { color: colors.back, label: "Серверная часть" },
        { color: colors.db, label: "База данных" }
    ];

    legendItems.forEach((item, index) => {
        const legendRect = document.createElementNS(svgNS, "rect");
        legendRect.setAttribute("x", legendXStart + index * 150);
        legendRect.setAttribute("y", legendYStart);
        legendRect.setAttribute("width", 20);
        legendRect.setAttribute("height", 20);
        legendRect.setAttribute("fill", item.color);
        legendRect.setAttribute("rx", "3");
        svg.appendChild(legendRect);

        const legendText = document.createElementNS(svgNS, "text");
        legendText.setAttribute("x", legendXStart + index * 150 + 30);
        legendText.setAttribute("y", legendYStart + 15);
        legendText.setAttribute("font-size", "10");
        legendText.setAttribute("fill", "#898290");
        legendText.setAttribute("font-weight", "400");
        legendText.setAttribute("font-family", "Roboto");
        legendText.textContent = item.label;
        svg.appendChild(legendText);
    });

    document.getElementById("app").appendChild(svg);
});
