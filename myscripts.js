const list_stat = new Map();
list_stat.set('Сила','power');
list_stat.set('Спритність','agility');
list_stat.set('Витривалість','vigor');
list_stat.set('Інтелект','intelligence');
list_stat.set('Мудрість','wisdom');
list_stat.set('Харизма','charisma');

function pageLoad(){
    select = document.getElementById('lvl');
    for (let i = 1; i <= 20; i++) {
        let opt = document.createElement('option');
        opt.value = i;
        opt.innerHTML = i;
        select.appendChild(opt);
    }
    let elements = document.getElementById('stats').children;
    for (let i = 0; i < elements.length; i++) {
        elements[i].children[1].value = 10;
        const newInput = document.createElement("input");
        newInput.type = "text";
        newInput.name = `${elements[i].children[1].name}_mod`;
        newInput.id = `${elements[i].children[1].name}_mod`;
        newInput.classList.add("stat-modifier");
        newInput.value = Math.floor((elements[i].children[1].value - 10) / 2);
        newInput.readOnly = true;
        const newLabel = document.createElement("label");
        newLabel.htmlFor = `${elements[i].children[1].name}_mod`;
        newLabel.innerHTML = "Модифікатор";
        elements[i].insertBefore(newInput,elements[i].children[0]);
    }
    let skill_block = document.getElementsByName("skill_stat");
    for(let i = 0;i<skill_block.length;i++){
        skill_block[i].querySelector('input[type="checkbox"]').setAttribute('onchange',"setAbilities(this)");
        setAbilities(skill_block[i].querySelector('input'));
    }

    const save_block = document.getElementsByName("save_stat");
    for(let i=0;i<save_block.length;i++){
        setSaveThrows(save_block[i].querySelector('input'));
    }
    createMagicCircles();
    magicAttackChange(document.getElementById("magic_stat"));

}


function createModifier(inputField) {
    document.getElementById(`${inputField.name}_mod`).value = Math.floor((inputField.value - 10) / 2);
    document.getElementById("initiative").value = document.getElementById("agility_mod").value;
    setSaveThrows(document.getElementById(`${inputField.name}_check`));
    let ability_by_skill = document.getElementById('skill_throw').querySelectorAll(`input[type="checkbox"][id*="${inputField.name}"]`);
    ability_by_skill.forEach(ability=>{setAbilities(ability)});
    let weapon = document.getElementsByName("weapon_table_body")[0].rows;
    for(let i =0; i<weapon.length;i++){
        if (list_stat.get(weapon[i].cells[2].lastElementChild.value) == inputField.name){
            if (weapon[i].cells[1].lastElementChild.checked == true){
                weapon[i].cells[3].lastElementChild.value = Math.floor((inputField.value - 10) / 2) + parseInt(document.getElementById("skill_bonus").value);
            }
            else{
                weapon[i].cells[3].lastElementChild.value = Math.floor((inputField.value - 10) / 2);
            }
            
        }
    }
    magicAttackChange(document.getElementById("magic_stat"));
    
}

function setSaveThrows(check_box){
    let name = check_box.name.split('_')[0];
    let mod = document.getElementById(`${name}_mod`).value||'0';
    let save = document.getElementById(`${name}_save`);
    console.log("save name: "+name);
    console.log("modifier name:" + save.name);
    if(check_box.checked==true){
        save.value = parseInt(mod) +parseInt(document.getElementById("skill_bonus").value);
    }
    else{
        save.value = parseInt(mod);
    }
}

function setAbilities(check_box){
    let name = check_box.name.split('_')[1];
    let base_name=check_box.name.split('_')[0];
    let mod = document.getElementById(`${base_name}_mod`).value||'0';
    let skill = document.getElementById(`${base_name}_${name}`);
    console.log("save name: "+name);
    if(check_box.checked==true){
        skill.value = parseInt(mod) +parseInt(document.getElementById("skill_bonus").value);
    }
    else{
        skill.value = parseInt(mod);
    } 
} 


function addWeapon(){
    const tableBody = document.getElementById('weapon_table_body');
      const newRow = document.createElement('tr');
      newRow.id = "weapon_#_" + tableBody.rows.length;
      const weaponNameCell = document.createElement('td');
      const weaponNameInput = document.createElement('input');
      weaponNameInput.type = 'text';
      weaponNameInput.id = 'weapon_name_'+tableBody.rows.length;
      weaponNameInput.name = 'weapon_name_'+tableBody.rows.length;
      weaponNameCell.appendChild(weaponNameInput);

      const skillCell = document.createElement('td');
      const skillCheckbox = document.createElement('input');
      skillCheckbox.type = 'checkbox';
      skillCheckbox.id = 'weapon_bonus_check_'+tableBody.rows.length;
      skillCheckbox.name = 'weapon_bonus_check_'+tableBody.rows.length;
      skillCell.appendChild(skillCheckbox);

      const scaleCell = document.createElement('td');
      const scaleSelect = document.createElement('select');
      list_stat.forEach((value,key) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = key;
        scaleSelect.appendChild(option);
      });
      scaleSelect.id = 'weapon_scale_'+tableBody.rows.length;
      scaleSelect.name = 'weapon_scale_'+tableBody.rows.length;
      scaleCell.appendChild(scaleSelect);

      const bonusAttackCell = document.createElement('td');
      const bonusAttackInput = document.createElement('input');
      bonusAttackInput.type = 'text';
      bonusAttackInput.id = 'weapon_attack_bonus_'+tableBody.rows.length;
      bonusAttackInput.name = 'weapon_attack_bonus_'+tableBody.rows.length;
      bonusAttackInput.value = document.getElementById(`${list_stat.get(scaleSelect.value)}_mod`).value || '0';
      bonusAttackCell.appendChild(bonusAttackInput);

      const damageCell = document.createElement('td');
      const damageInput = document.createElement('input');
      damageInput.type = 'text';
      damageInput.id = 'weapon_dmg_'+tableBody.rows.length;
      damageInput.name = 'weapon_dmg_'+tableBody.rows.length;
      damageCell.appendChild(damageInput);

      newRow.appendChild(weaponNameCell);
      newRow.appendChild(skillCell);
      newRow.appendChild(scaleCell);
      newRow.appendChild(bonusAttackCell);
      newRow.appendChild(damageCell);

      tableBody.appendChild(newRow);
      
      function updateBonusAttack() {
        const skill_bonus=parseInt(document.getElementById("skill_bonus").value);
        const stat_mod = parseInt(document.getElementById(`${list_stat.get(scaleSelect.value)}_mod`).value || 0);
        if(skillCheckbox.checked){
            bonusAttackInput.value = stat_mod + skill_bonus;
        }
        else{
            bonusAttackInput.value = stat_mod;
        }
      }

      skillCheckbox.addEventListener('change', updateBonusAttack);
      scaleSelect.addEventListener('change', updateBonusAttack);
}
function deathCheck(){
    const success_checkboxes = document.querySelectorAll('input[name="success[]"]:checked').length;
    const fail_checkboxes = document.querySelectorAll('input[name="fail[]"]:checked').length;

    if (success_checkboxes === 3) {
        alert('Ти вижив, вітання!!!');
    }

    if (fail_checkboxes === 3) {
        alert('Я сподіваюсь в тебе є лист із запасним персонажем');
    }
}
function openTab(evt, tabName) {
    // Declare all variables
    let i, tabcontent, tablinks;
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
  }
function magicAttackChange(statValue){
    const stat_mod = parseInt(document.getElementById(`${statValue.value}_mod`).value)||0;
    const skill_bonus = parseInt(document.getElementById('skill_bonus').value);
    document.getElementById("attack_magic_bonus").value = stat_mod+skill_bonus;
    document.getElementById("save_throw_magic").value = 8+skill_bonus+stat_mod; 
}

function createMagicCircles(){
    function createTable(id, name) {
        const table = document.createElement('table');
        
        const nameRow = document.createElement('tr');
        const nameCell = document.createElement('td');
        nameCell.colSpan = 4; // Span across all columns
        nameCell.textContent = name;
        nameCell.className = 'table-name';
        nameRow.appendChild(nameCell);
        table.appendChild(nameRow);

        const headerRow = document.createElement('tr');

        const checkboxHeader = document.createElement('th');
        checkboxHeader.textContent = 'Підготовка';
        headerRow.appendChild(checkboxHeader);

        const spellNameHeader = document.createElement('th');
        spellNameHeader.textContent = 'Назва';
        headerRow.appendChild(spellNameHeader);

        const spellInfoHeader = document.createElement('th');
        spellInfoHeader.textContent = 'Опис';
        headerRow.appendChild(spellInfoHeader);

        const deleteHeader = document.createElement('th');
        deleteHeader.textContent = '';
        headerRow.appendChild(deleteHeader);

        table.appendChild(headerRow);
        table.id = 'magic_table_' + id.split('_')[1];
        return table;
    }

    function addSpellRow(table) {
        let spell_count = table.rows.length-1;
        const dataRow = document.createElement('tr');

        const checkboxCell = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'spell_check_'+spell_count;
        checkboxCell.appendChild(checkbox);
        dataRow.appendChild(checkboxCell);

        const spellNameCell = document.createElement('td');
        const spellNameInput = document.createElement('input');
        spellNameInput.type = 'text';
        spellNameInput.placeholder = 'Назва заклинання';
        spellNameInput.name = 'spell_name_'+spell_count;
        spellNameCell.appendChild(spellNameInput);
        dataRow.appendChild(spellNameCell);

        const spellInfoCell = document.createElement('td');
        const spellInfoInput = document.createElement('textarea');
        spellInfoInput.placeholder = 'Інформація';
        spellInfoInput.name = 'spell_info_'+spell_count;
        

        function autoResize() {
            this.style.height = '20px'; // Reset the height so it can shrink if needed
            const newHeight = this.scrollHeight + 'px';
            this.style.transition = 'height 0.3s ease-in';
            this.style.height = newHeight;
          }
          
        function resetSize() {
            this.style.height = '20px';
            this.style.transition = 'height 0.3s ease-in';
        }
        spellInfoInput.addEventListener('input', autoResize); 
        spellInfoInput.addEventListener('focus', autoResize);
        spellInfoInput.addEventListener('blur', resetSize); 
        
        
        spellInfoCell.appendChild(spellInfoInput);
        dataRow.appendChild(spellInfoCell);

        const deleteCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Прибрати';
        deleteButton.addEventListener('click', () => {
            table.removeChild(dataRow);
        });
        deleteCell.appendChild(deleteButton);
        dataRow.appendChild(deleteCell);

        table.appendChild(dataRow);
    }

    for (let i = 1; i <= 9; i++) {
        const div = document.createElement('div');
        div.className = 'circle';
        div.id = `circle_${i}`;

        const tableName = `Коло ${i}`;
        const table = createTable(div.id, tableName);
        addSpellRow(table);  // Add initial spell row
        div.appendChild(table);

        const addSpellBtn = document.createElement('button');
        addSpellBtn.className = 'add-spell-btn';
        addSpellBtn.textContent = 'Додати заклинання';
        addSpellBtn.onclick=function(){addSpellRow(table)};
        div.appendChild(addSpellBtn);

        document.getElementById('magic_circles').appendChild(div);
    }
}
function bonusChange(){
    const lvlInput = document.getElementById("lvl");
    let lvl = lvlInput.value;
    console.log("lvl: " + lvl);
    let new_skill_bonus = Math.floor(lvl / 4);
    console.log("skill: " + new_skill_bonus);
    if (lvl % 4 == 0) {
        new_skill_bonus--;
    }
    document.getElementById('skill_bonus').value = '+' + (new_skill_bonus + 2);
    const skill_block = document.getElementsByName("skill_stat");
    for(let i = 0;i<skill_block.length;i++){
        if (skill_block[i].querySelector('input[type="checkbox"]').checked == true)
        {
            setAbilities(skill_block[i].querySelector('input'));
        }
        
    }

    const save_block = document.getElementsByName("save_stat");
    for(let i=0;i<save_block.length;i++){
        if (save_block[i].querySelector('input[type="checkbox"]').checked == true)
            {
                setSaveThrows(save_block[i].querySelector('input'));
            }
    }
    
    const rows = document.getElementById('weapon_table_body').getElementsByTagName('tr');
            
            // Loop through each row
            for (let i = 0; i < rows.length; i++) {
                const checkbox = rows[i].getElementsByTagName('input')[1]; // Get the checkbox in the row
                const attackBonusCell = rows[i].getElementsByTagName('input')[2]; // Get the attack bonus cell (4th cell)
                const skill_bonus=parseInt(document.getElementById("skill_bonus").value);
                const stat_mod = parseInt(document.getElementById(`${list_stat.get(rows[i].getElementsByTagName('select')[0].value)}_mod`).value || 0);
                // Check if the checkbox is checked
                if (checkbox.checked) {
                    attackBonusCell.value = stat_mod+skill_bonus; // Change this to the desired value
                }
            }
            magicAttackChange(document.getElementById("magic_stat"));

}

function addItemRow() {
    // Get the table element
    const tableBody = document.getElementById('item_table_body');
    const newRow = document.createElement('tr');
    newRow.id = "item_#_" + tableBody.rows.length;

    const itemCheckBoxCell = document.createElement('td');
    const itemCheckBoxInput = document.createElement('input');
    itemCheckBoxInput.type = 'checkbox';
    itemCheckBoxInput.id = 'item_checkbox_'+tableBody.rows.length;
    itemCheckBoxInput.name = 'item_checkbox_'+tableBody.rows.length;
    itemCheckBoxCell.appendChild(itemCheckBoxInput);


    const itemNameCell = document.createElement('td');
    const itemNameInput = document.createElement('input');
    itemNameInput.type = 'text';
    itemNameInput.id = 'item_name_'+tableBody.rows.length;
    itemNameInput.name = 'item_name_'+tableBody.rows.length;
    itemNameCell.appendChild(itemNameInput);

    const itemInfoCell = document.createElement('td');
    const itemInfoInput = document.createElement('textarea');
    itemInfoInput.type = 'text';
    itemInfoInput.id = 'item_info_'+tableBody.rows.length;
    itemInfoInput.name = 'item_info_'+tableBody.rows.length;
    itemInfoCell.appendChild(itemInfoInput);

    const deleteCell = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Прибрати';
    deleteButton.addEventListener('click', () => {
        tableBody.removeChild(newRow);
    });
    deleteCell.appendChild(deleteButton);


    newRow.appendChild(itemCheckBoxCell);
    newRow.appendChild(itemNameCell);
    newRow.appendChild(itemInfoCell);
    newRow.append(deleteCell);

    tableBody.appendChild(newRow);
    
    function autoResize() {
        this.style.height = '26.89px'; // Reset the height so it can shrink if needed
        const newHeight = this.scrollHeight + 'px';
        this.style.transition = 'height 0.3s ease-in';
        this.style.height = newHeight;
      }
      
    function resetSize() {
        this.style.height = '26.89px';
        this.style.transition = 'height 0.3s ease-in';
    }
    itemInfoInput.addEventListener('input', autoResize); 
    itemInfoInput.addEventListener('focus', autoResize);
    itemInfoInput.addEventListener('blur', resetSize); 
}

function deleteItemRow(button) {
    // Get the row to be deleted
    let row = button.parentNode.parentNode;

    // Remove the row from the table
    row.parentNode.removeChild(row);
}

function save_character(){

    function divReader(div_elements, deep, div_name){//deep = глубина
            if(deep == 1){
                div_elements.forEach(info => {
                    character[`${info.name}`] = info.value;
                })
            }
            if(deep == 2){
                character[`${div_name}`] = {};
                div_elements.forEach(info => {
                    if(info.type == "checkbox"){
                        character[`${div_name}`][`${info.name}`] = info.checked;
                    }
                    else{
                        character[`${div_name}`][`${info.name}`] = info.value;
                    }
                })
            }  
    }


    const character = {};
    let main_info = document.querySelectorAll("#main_info input:not(#skill_bonus), #main_info select");
    divReader(main_info, 1, "0")

    const stats = document.querySelectorAll('#stats input[type="number"]:not([name*="mod"])');
    divReader(stats, 2, "stats")

    const save_throws = document.querySelectorAll("#save_throw input[type='checkbox']");
    divReader(save_throws, 2, "save_throws")

    const skill_throws = document.querySelectorAll("#skill_throw input[type='checkbox']");
    divReader(skill_throws, 2, "skill_throws");

    const armor_initiative_speed = document.querySelectorAll("#armor_initiative_speed input");
    divReader(armor_initiative_speed,1,"");

    const hp = document.querySelectorAll("#hp input,#hp textarea");
    divReader(hp,1,"");

    const dice_hp = document.querySelectorAll("#dice_hp input,#dice_hp select");
    divReader(dice_hp,1,"");

    const character_personality = document.querySelectorAll("#character_personality textarea");
    divReader(character_personality,1,"");

    const loot_and_other = document.querySelectorAll("#loot_and_other textarea");
    divReader(loot_and_other,1,'');

    const money = document.querySelectorAll("#money input");
    divReader(money,2,"money");

    const weapon = document.querySelectorAll('#weapon_table_body tr');
    character["weapon"] = {};
    weapon.forEach(weapon =>{
        character["weapon"][weapon.id] = {};
        weapon.querySelectorAll("td").forEach(weaponcell => {
            let inputElement = weaponcell.querySelector("input, select");
            if(inputElement.type === "checkbox"){
                character["weapon"][weapon.id][inputElement.name] = inputElement.checked;
            }
            else if(inputElement.type === "select-one"){
                character["weapon"][weapon.id][inputElement.name] = inputElement.value;
            }
            else{
                character["weapon"][weapon.id][inputElement.name] = inputElement.value;
            }
        })
    })

    const circles = document.querySelectorAll('#magic_circles .circle');
    character.circles = {};
    circles.forEach(circle => {
        character.circles[circle.id] = {};

        for(let j = 2; j < circle.childNodes[0].childElementCount; j++){
            character["circles"][circle.id][`spell_${j-1}`] = {};
            let spell = circle.childNodes[0].childNodes[j];
            spell.querySelectorAll("input, textarea").forEach(spell_cells =>{
                if(spell_cells.type === "checkbox"){
                    character["circles"][circle.id][`spell_${j-1}`][spell_cells.name] = spell_cells.checked;
                }
                else{
                    character["circles"][circle.id][`spell_${j-1}`][spell_cells.name] = spell_cells.value;
                }
            })
            
        }
    })

    const items = document.querySelectorAll('#item_table_body tr');
    character["item"] = {};
    items.forEach(item =>{
        character["item"][item.id] = {};
        item.querySelectorAll("td").forEach(itemcell => {
            let inputElement = itemcell.querySelector("input, textarea");
            if(inputElement === null){
                return;
            }
            else if(inputElement.type === "checkbox"){
                character["item"][item.id][inputElement.name] = inputElement.checked;
            }
            else{
                character["item"][item.id][inputElement.name] = inputElement.value;
            }
        })
    })

    const JSONToFile = (obj, filename) => {
        const blob = new Blob([JSON.stringify(obj, null, 2)], {
          type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.json`;
        a.click();
        URL.revokeObjectURL(url);
      };
      
      JSONToFile(character, prompt('how to name file?'));
}

(function(){//я не знаю что тут происходит, только знаю что файл когда читается я могу с него обьект вытащить
    
    function onChange(event) {
        var reader = new FileReader();
        reader.onload = onReaderLoad;
        reader.readAsText(event.target.files[0]);
    }

    function onReaderLoad(event){
        let obj = JSON.parse(event.target.result);
        loadCharacter(obj);
    }
 
    document.getElementById('file').addEventListener('change', onChange);

}());

function loadCharacter(character){
    console.log(character);
    Object.entries(character).forEach(([elem_name,value]) => {
        console.log(elem_name + " => " + typeof(value));
        if(typeof(value) == 'object'){
            if(elem_name == "stats")
            {
                Object.entries(value).forEach(([second_name,second_value]) => {
                    document.getElementById(second_name).value = second_value;
                    document.getElementById(second_name).onchange();
                })
            }
            if(elem_name == "save_throws" || elem_name == "skill_throws")
            {
                Object.entries(value).forEach(([second_name,second_value]) => {
                    let r = document.getElementById(second_name);
                    document.getElementById(second_name).checked = second_value;
                    document.getElementById(second_name).onchange();
                })
            }
            if(elem_name == "money"){
                Object.entries(value).forEach(([second_name,second_value]) => {
                    let r = document.getElementById(second_name);
                    document.getElementById(second_name).value = second_value;
                })
            }
            if(elem_name == "weapon"){
                Object.entries(value).forEach(([second_name,second_value]) => {
                    addWeapon();
                    Object.entries(second_value).forEach(([weapon_cell_name,weapon_cell_value]) => {
                        let cell = document.getElementById(weapon_cell_name);
                        if(cell.type === 'checkbox')
                        {
                            cell.checked = weapon_cell_value;
                        }
                        else{
                            cell.value = weapon_cell_value;
                        }
                    })
                })
            }
            if(elem_name == "item"){
                Object.entries(value).forEach(([second_name,second_value]) =>{
                    addItemRow();
                    Object.entries(second_value).forEach(([item_cell_name,item_cell_value]) => {
                        let cell = document.getElementById(item_cell_name);
                        if(cell.type === 'checkbox')
                        {
                            cell.checked = item_cell_value;
                        }
                        else{
                            cell.value = item_cell_value;
                        }
                    })
                })
            }
            if(elem_name == "circles"){
                Object.entries(value).forEach(([second_name,second_value]) => {
                    let circle = document.querySelectorAll("#"+second_name+" table");
                    console.log(circle);
                    Object.entries(second_value).forEach(([spell_number,spell_data]) => {
                        document.querySelector(`#${second_name} .add-spell-btn`).onclick();
                        Object.entries(spell_data).forEach(([spell_cell_name,spell_cell_value]) => {
                            let cell = document.querySelector(`#${second_name} [name="${spell_cell_name}"] `);
                            if(cell.type === 'checkbox')
                                {
                                    cell.checked = spell_cell_value;
                                }
                            else{
                                cell.value = spell_cell_value;
                            }
                            
                        })
                    })
                })
            }
            return;
        }
        else{
            document.getElementById(elem_name).value = value;
        }
    })
    document.getElementById('lvl').onchange();
}

function dmgRoll(str){
    function rollDie(sides) {
        let result = (Math.floor(Math.random() * sides) + 1);
        return result;
    }
      const dicePattern = /(\d*)d(\d+)|(\d+)/g;
      let match;
      let total = 0;
      let result = '';
      let dice_array = [];
      while ((match = dicePattern.exec(str)) !== null) {
        if (match[2]) {
          const numberOfDice = parseInt(match[1] || '1', 10); // match[1] is the number of dice
          const sides = parseInt(match[2], 10); // match[2] is the number of sides
    
          for (let i = 0; i < numberOfDice; i++) {
            let dice = rollDie(sides);
            dice_array.push(dice);
            total += dice;
          }
        } else if (match[3]) {
          total += parseInt(match[3], 10);
          dice_array.push(parseInt(match[3], 10)) // match[3] is the flat number
        }
      }
      dice_array.forEach(value =>{
        result += value + "+";
      })
      result = result.slice(0,-1);
      result+=`=${total}`
      let resultStr = `(${str})` + '\nВаш кидок ' + result + '\n';
      let story = document.getElementById("dice_story").value;
      document.getElementById("dice_story").value = story.padStart(story.length + resultStr.length, resultStr);  
      return result;
}

const handle_roll20 = function(event){roll20(this.value)};
const handle_dmg_roll = function(event){dmgRoll(this.value)};

function diceMode(input){
    const d20_input = document.querySelectorAll("#save_stat input:not([type='checkbox']), #skill_stat input:not([type='checkbox']),input[name^='weapon_attack_bonus']");
    const dmg_inputs = document.querySelectorAll('#custom_input, input[name^="weapon_dmg_"]');
    const dice = document.querySelector('.dice');

    if(input.checked){
        Object.entries(dmg_inputs).forEach(([input_name,input_value]) => {
            dice.classList.add('rotating');
            input_value.readOnly = true;
            input_value.classList.add("inputRollClass");
            input_value.addEventListener("click", handle_dmg_roll);
        })    
        Object.entries(d20_input).forEach(([input_name,input_value]) => {
            input_value.classList.add("inputRollClass");
            input_value.readOnly = true;
            input_value.addEventListener("click", handle_roll20);
        })
    }
    else{
        Object.entries(dmg_inputs).forEach(([input_name,input_value]) => {
            dice.classList.remove('rotating');
            input_value.readOnly = false;
            input_value.classList.remove("inputRollClass");
            input_value.removeEventListener("click", handle_dmg_roll);
        }) 
        Object.entries(d20_input).forEach(([input_name,input_value]) => {
            input_value.classList.remove("inputRollClass");
            input_value.readOnly = false;
            input_value.removeEventListener("click", handle_roll20);
        })
    }
}

function toggleDiceModeCheckbox() {
    const checkbox = document.getElementById('roll_mode');
    checkbox.checked = !checkbox.checked;
    diceMode(checkbox); // Trigger the diceMode function to apply or remove the rotation
  }

function roll20(bonus) {
    let roll = (Math.floor(Math.random() * 20) + 1);
    let story = document.getElementById("dice_story").value;
    let result = "(1d20 + " + parseInt(bonus) + ")\nВаш кидок "+ roll + "+" + parseInt(bonus) + "=" + (roll + parseInt(bonus))+'\n';
    document.getElementById("dice_story").value = story.padStart(story.length + result.length, result); 
    return roll + parseInt(bonus);
}


function addDie(){
    let dieButtons = Array.from(document.querySelectorAll('#calculator button')).filter(button => button.textContent !== '+' && button.textContent !== '-');
    dieButtons.forEach(dieButton => {
        let size = dieButton.value.split('d')[1];
        let count = dieButton.value.split('d')[0];
        count++;
        dieButton.value = count + 'd' + size;
        dieButton.textContent = count + 'd' + size;
    })
}

function removeDie(){
    let dieButtons = Array.from(document.querySelectorAll('#calculator button')).filter(button => button.textContent !== '+' && button.textContent !== '-');
    dieButtons.forEach(dieButton => {
        let size = dieButton.value.split('d')[1];
        let count = dieButton.value.split('d')[0];
        count--;
        if(count<=0){
            return;
        }
        dieButton.value = count + 'd' + size;
        dieButton.textContent = count + 'd' + size;
    })
}

function clearHistory(){
    document.querySelector('#dice_story').value = '';
}

pageLoad();
