(function () {

    var data = {
        "name": "Json Tree",
        "children": [
            {
                "name": "Author: RedHood"
            },
            {
                "name": "Date: 2014-9-8"
            }
        ] 
    }; // 数据
    var setting; // 设置
    var color = ['#ecda54', '#f1a66a', '#9ed768', '#65d8c5', '#7da5e8']; // 颜色
    setting = {
        width: 500,
        height: 400
    };

    var $textarea = $('textarea'), // 输入框
        $hint = $('#hint');  // 提示

    // 输入时实时生成树
    $textarea.on('keyup', function () {
        try {
            data = JSON.parse($textarea.val());
            generate();
            save($textarea.val());
            $hint.text('');
        } catch (e) {
            $hint.text(e.message);
        }
    });
    $('body').on('click', '.left-arrow', function () {
        // 减小数值
        var target = $(this).attr('target');
        if (setting[target] > 5) {
            setting[target] = setting[target] - 5;
        }
        updateWidthHeight();
    }).on('click', '.right-arrow', function () {
        // 减小数值
        var target = $(this).attr('target');
        setting[target] = setting[target] + 5;
        updateWidthHeight();
    });

    // 加载数据
    if (localStorage['JsonTree']) {
        $textarea.val(localStorage['JsonTree']);
        try {
            data = JSON.parse(localStorage['JsonTree']);
            setting = JSON.parse(localStorage['JsonTreeSetting']);
        } catch (e) {}
    } else {
        $textarea.val(JSON.stringify(data));
    }
    generate();
    // 宽度，高度控制
    var $widthValue = $('#width-value'),
        $heightValue = $('#height-value');
    updateWidthHeight();

    // 生成树
    function generate() {
        // 将树整个清除重新生成
        d3.selectAll('svg').remove();

        var area = {
            width: setting.width,
            height: setting.height,
            padding: 150
        };

        var tree = d3.layout.tree()
             .size([area.height - area.padding * 2, area.width - area.padding * 2])
             .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

        var diagonal = d3.svg.diagonal()
            .projection(function(d) { return [d.y, d.x]; });

        var svg = d3.select("#container").append("svg")
            .attr("width", area.width)
            .attr("height", area.height)
            .append("g")
            .attr("transform", "translate(" + area.padding + ", " + area.padding + ")");

        var nodes = tree.nodes(data),
            links = tree.links(nodes);
        var link = svg.selectAll(".link").data(links);

        var linkEnter = link.enter().append("path")
                      .attr("class", "link")
                      .attr("d", diagonal);

        var node = svg.selectAll(".node").data(nodes);

        var nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { 
                return "translate(" + d.y + "," + d.x + ")";
            });

        nodeEnter.append("circle")
            .attr("r", function (d) {
                return d.r || 4.5;
            }).style('stroke', function (d) {
                return color[d.depth];
            });

        nodeEnter.append("text")
            .attr("dy", ".1em")
            .text(function(d) { return d.name; })
            .attr("y", function(d) {
                return d.children || d._children ? -20 : 3; 
            }).attr("x", function(d) {
                return d.children || d._children ? 0 : 20; 
            }).attr("text-anchor", function (d) {
                return d.children || d._children ? 'middle' : 'start';
            });
    }

    // 保存
    function save(data) {
        localStorage['JsonTree'] = data;
    }

    // 更新宽高
    function updateWidthHeight() {
        $widthValue.text(setting['width']);
        $heightValue.text(setting['height']);
        localStorage['JsonTreeSetting'] = JSON.stringify(setting);
        generate();
    }

    // textarea支持TAB
    // http://css-tricks.com/snippets/javascript/support-tabs-in-textareas/
    HTMLTextAreaElement.prototype.getCaretPosition = function () {
        return this.selectionStart;
    };
    HTMLTextAreaElement.prototype.setCaretPosition = function (position) {
        this.selectionStart = position;
        this.selectionEnd = position;
        this.focus();
    };
    HTMLTextAreaElement.prototype.hasSelection = function () {
        if (this.selectionStart == this.selectionEnd) {
            return false;
        } else {
            return true;
        }
    };
    HTMLTextAreaElement.prototype.getSelectedText = function () {
        return this.value.substring(this.selectionStart, this.selectionEnd);
    };
    HTMLTextAreaElement.prototype.setSelection = function (start, end) {
        this.selectionStart = start;
        this.selectionEnd = end;
        this.focus();
    };
    var textarea = document.getElementsByTagName('textarea')[0]; 
    textarea.onkeydown = function(event) {
        if (event.keyCode == 9) {
            var newCaretPosition;
            newCaretPosition = textarea.getCaretPosition() + "        ".length;
            textarea.value = textarea.value.substring(0, textarea.getCaretPosition()) + "        " + textarea.value.substring(textarea.getCaretPosition(), textarea.value.length);
            textarea.setCaretPosition(newCaretPosition);
            return false;
        }
        if(event.keyCode == 8){
            if (textarea.value.substring(textarea.getCaretPosition() - 4, textarea.getCaretPosition()) == "        ") { 
                var newCaretPosition;
                newCaretPosition = textarea.getCaretPosition() - 3;
                textarea.value = textarea.value.substring(0, textarea.getCaretPosition() - 3) + textarea.value.substring(textarea.getCaretPosition(), textarea.value.length);
                textarea.setCaretPosition(newCaretPosition);
            }
        }
        if(event.keyCode == 37){
            var newCaretPosition;
            if (textarea.value.substring(textarea.getCaretPosition() - 4, textarea.getCaretPosition()) == "        ") { 
                newCaretPosition = textarea.getCaretPosition() - 3;
                textarea.setCaretPosition(newCaretPosition);
            }    
        }
        if(event.keyCode == 39){
            var newCaretPosition;
            if (textarea.value.substring(textarea.getCaretPosition() + 4, textarea.getCaretPosition()) == "        ") { 
                newCaretPosition = textarea.getCaretPosition() + 3;
                textarea.setCaretPosition(newCaretPosition);
            }
        } 
    }

})();

