/*-------------------------------------------------
///////////////////////////////////////////////////
АвтоФайзы, АвтоБотл, АвтоСтики, АвтоМека, АвтоУрна
Автор: vk.com/lalka_karo4
///////////////////////////////////////////////////
-----------------------End-----------------------*/

/*
try {
    Game.Panels.ItemsPanel.DeleteAsync(0)
} catch (e) { }
*/
var interval = 0.1
var HP = 0

phase = true;
stick = true;
bottle = true;
urn = true;
meka = true;



var Items = [
    'item_magic_stick',
    'item_magic_wand',
    'item_phase_boots',
    'item_bottle',
    'item_urn_of_shadows',
    'item_mekansm',
    'item_guardian_greaves'
]

var ImportantBuffs = [
    'modifier_teleporting',
    'modifier_tinker_rearm',
    //бх, рики, вивер, енигма блекхол, бейн ульта, задувка котла, связка шамана, тп фуры, пудж дизмембер, ск эпицентр, цм ульт, варлок 3, 
]

var Buffs = [
    'modifier_item_mekansm_noheal',
    'modifier_fountain_aura_buff',
    'modifier_teleporting'
]

function Toggler() {

    Game.AddCommand("__PhaseBoots_Toggle", function () {
        if (phase == true)
            phase = false
        else
            phase = true
    }, "", 0)

    Game.AddCommand("__Stick_Toggle", function () {
        if (stick == true)
            stick = false
        else
            stick = true
    }, '', 0)

    Game.AddCommand('__Bottle_Toggle', function () {
        if (bottle == true)
            bottle = false
        else
            bottle = true
    }, '', 0)

    Game.AddCommand('__UrnOfShadows_Toggle', function () {
        if (urn == true)
            urn = false
        else
            urn = true
    }, '', 0)

    Game.AddCommand('__MekaAndGreaves_Toggle', function () {
        if (meka == true)
            meka = false
        else
            meka = true
    }, '', 0)
}


function AutoUseF() {
    if (!AutoUse.checked)
        return
    /*
    for (var i = 0; i < array.length; i++)
    {
        array[i]
    }
    */
    var User = Players.GetPlayerHeroEntityIndex(Game.GetLocalPlayerID())
    var UserBuffs = Game.GetBuffsNames(User)

    // Получение предметов 
    var Stick = Game.GetAbilityByName(User, 'item_magic_stick')
    var Wand = Game.GetAbilityByName(User, 'item_magic_wand')
    var Phase = Game.GetAbilityByName(User, 'item_phase_boots')
    var Bottle = Game.GetAbilityByName(User, 'item_bottle')
    var Urn = Game.GetAbilityByName(User, 'item_urn_of_shadows')
    var Meka = Game.GetAbilityByName(User, 'item_mekansm')
    var Greaves = Game.GetAbilityByName(User, 'item_guardian_greaves')


    // Проверка на один из предметов, если нет, то возвращаемся
    /* 
    for (var i in Items) {
        var hasItem = Entities.HasItemInInventory(User, Items[i])
        if (!hasItem) {
            AutoUse.checked = false;
            Game.ScriptLogMsg('Script disabled: Not have item', '#ff0000')
            return
        }
    }
        
    if (!AutoUse.checked) {
        try {
            Game.Panels.ItemsPanel.DeleteAsync(0)
        } catch (e) { }
        return
    }

    var AbPanel = Game.Panels.RubickAutoSteal.Children()
    var z = []
    for (i in AbPanel)
        if (AbPanel[i].style.opacity == 1 || AbPanel[i].style.opacity == null)
            z.push(AbPanel[i].Children()[0].abilityname)
    */

    // Если Файзы есть в инвентаре
    if (Game.GetAbilityByName(User, 'item_phase_boots') != -1) {
        // Если включены
        if (phase == true) {
            // Если нет кд
            if (Abilities.IsCooldownReady(Phase))
                // Если гейрой не в инвизе и не телепортируется
                if (!Entities.IsInvisible(User) && !Game.IntersecArrays(UserBuffs, ImportantBuffs))
                    // Каст предмета
                    Game.CastNoTarget(User, Phase, false)
        }
    }

    // Если Стики есть в инвентаре
    if ((Game.GetAbilityByName(User, 'item_magic_stick') || (Game.GetAbilityByName(User, 'item_magic_wand'))) != -1) {
        // Если включены
        if (stick == true) {
            // Если нет кд и есть хоть один заряд
            if (Abilities.IsCooldownReady(Stick) && (Abilities.GetCurrentCharges(Stick) >0))
                // Magick Stick - если порог 150 хп + герой не в инвизе + Баффы
                if ((Entities.GetHealth(User) <= 150) && !Entities.IsInvisible(User) && !Game.IntersecArrays(UserBuffs, Buffs) && !Game.IntersecArrays(UserBuffs, ImportantBuffs))
                    Game.CastNoTarget(User, Stick, false)
            // Если нет кд
            if (Abilities.IsCooldownReady(Wand) && (Abilities.GetCurrentCharges(Wand) > 0))
                // Magick Wand - если порог 100 хп + герой не в инвизе + Баффы
                if ((Entities.GetHealth(User) <= 100) && !Entities.IsInvisible(User) && !Game.IntersecArrays(UserBuffs, Buffs) && !Game.IntersecArrays(UserBuffs, ImportantBuffs))
                    Game.CastNoTarget(User, Wand, false)
        }
    }

    // Если Мека есть в инвентаре
    if ((Game.GetAbilityByName(User, 'item_mekansm') || (Game.GetAbilityByName(User, 'item_guardian_greaves'))) != 1) {
        // Если включена
        if (meka == true) {
            // Если нет кд
            if (Abilities.IsCooldownReady(Meka) && Abilities.IsOwnersManaEnough(Meka))
                // Mekansm - если порог 200 хп + герой не в инвизе + Баффы
                if ((Entities.GetHealth(User) <= 200) && !Entities.IsInvisible(User) && !Game.IntersecArrays(UserBuffs, Buffs) && !Game.IntersecArrays(UserBuffs, ImportantBuffs))
                    Game.CastNoTarget(User, Meka, false)
            // Если нет кд
            if (Abilities.IsCooldownReady(Greaves) && Abilities.IsOwnersManaEnough(Greaves))
                // Guardian Greaves - если порог 200 хп + герой не в инвизе + Баффы
                if ((Entities.GetHealth(User) <= 200) && !Entities.IsInvisible(User) && !Game.IntersecArrays(UserBuffs, Buffs) && !Game.IntersecArrays(UserBuffs, ImportantBuffs))
                    Game.CastNoTarget(User, Greaves, false)
        }
    }

    // Если Урна есть в инвентаре
    if (Game.GetAbilityByName(User, 'item_urn_of_shadows') != -1) {
        // Если Включена
        if (urn == true) {
            // Если нет кд
            if (Abilities.IsCooldownReady(Urn) && (Abilities.GetCurrentCharges(Urn) > 0))
                // Urn Of Shadows - на себя если порог 200 хп + герой не в инвизе + Баффы
                if ((Entities.GetHealth(User) <= 200) && !Entities.IsInvisible(User) && !Game.IntersecArrays(UserBuffs, ImportantBuffs))
                    Game.CastTarget(User, Urn, User, false)
        }
    }

    // Если есть в инвентаре
    if (Game.GetAbilityByName(User, 'item_bottle') != 1) {
        // Если Ботл включен
        if (bottle == true) {
            // Если нет кд
            if (Abilities.IsCooldownReady(Bottle))
                // Если нет бафа на реген от ботла + есть бафф от фонтана + нет баффа телепортации
                if (!Game.IntersecArrays(UserBuffs, ["modifier_bottle_regeneration"]) && Game.IntersecArrays(UserBuffs, ['modifier_fountain_aura_buff']) && !Game.IntersecArrays(UserBuffs, ImportantBuffs))
                    Game.CastNoTarget(User, Bottle, false)
        }
    }

    //Старый код
    /*
    if (Entities.HasItemInInventory(User, 'item_phase_boots')) {
        if (phase == true)
            if (CDPhase == 0)
                if (!Entities.IsInvisible(User) && !Game.IntersecArrays(UserBuffs, ['modifier_teleporting']))
                    Game.CastNoTarget(User, Phase, 1)
    }
    
    // Если есть Стики и включены, то они автоматически юзаются при достижении 150(Magick Stick) и 100(Magick Wand)
    if ((Entities.HasItemInInventory(User, 'item_magic_stick')) || (Entities.HasItemInInventory(User, 'item_magic_wand'))) 
        if (stick == true) {
            if (CDStick == 0)
                // Magick Stick
                if ((Entities.GetHealth(User) <= 150) && (HP > Entities.GetHealth(User)) && !Entities.IsInvisible(User) && !Game.IntersecArrays(UserBuffs, Buffs))
                    Game.CastNoTarget(User, Stick, false)
            if (CDWand == 0)
                // Magick Wand
                if ((Entities.GetHealth(User) <= 100) && (HP > Entities.GetHealth(User)) && !Entities.IsInvisible(User) && !Game.IntersecArrays(UserBuffs, Buffs))
                    Game.CastNoTarget(User, Wand, false)
        }

    // Если есть Мека или Грейвсы и включены, то они автоматически юзаются при достежении 150 хп
    if ((Entities.HasItemInInventory(User, 'item_mekansm')) || (Entities.HasItemInInventory(User, 'item_guardian_greaves')))
        if (meka == true) {
            // Если нет кд
            if (CDMeka == 0)
                // Mekansm
                if ((Entities.GetHealth(User) <= 150) && (HP > Entities.GetHealth(User) && !Entities.IsInvisible(User)) && !Game.IntersecArrays(UserBuffs, Buffs))
                    Game.CastNoTarget(User, Meka, false)
            // Если нет кд
            if (CDGreaves == 0)
                // Guardian Greaves
                if ((Entities.GetHealth(User) <= 150) && (HP > Entities.GetHealth(User) && !Entities.IsInvisible(User)) && !Game.IntersecArrays(UserBuffs, Buffs))
                    Game.CastNoTarget(User, Greaves, false)
        }

    // Если есть Урна и включена, то они автоматически юзаются при достежении 150 хп
    if (Entities.HasItemInInventory(User, 'item_urn_of_shadows')) {
        if (urn == true)
            if ((Entities.GetHealth(User) <= 150) && (HP > Entities.GetHealth(User) && !Entities.IsInvisible(User)) && !Game.IntersecArrays(UserBuffs, ['modifier_teleporting']))
                Game.CastTarget(User, Urn, User, false)
    }

    // Если есть Ботл и включен, то он автоматически юзаются на фонтане
    if (Entities.HasItemInInventory(User, 'item_bottle')) {
        if (bottle == true)
            if (!Game.IntersecArrays(UserBuffs, ["modifier_bottle_regeneration"]) && Game.IntersecArrays(UserBuffs, ['modifier_fountain_aura_buff']) && !Game.IntersecArrays(UserBuffs, ['modifier_teleporting']))
                Game.CastNoTarget(User, Bottle, false)
    }

    */

}

/*
var ItemsPanel = function () {
    Game.Panels.ItemsPanel = $.CreatePanel('Panel', Game.GetMainHUD(), 'ItemsPanel')
    Game.Panels.ItemsPanel.BLoadLayoutFromString('<root><Panel style="border: 1px solid #000;background-color:#000000EE;flow-children:down-wrap;max-width:200px;border-radius:10px;padding:5px 3px;" onactivate="Add()"></Panel></root>', false, false)
    GameUI.MovePanel(Game.Panels.ItemsPanel, function (p) {
        var position = p.style.position.split(' ')
        Config.MainPanel.x = position[0]
        Config.MainPanel.y = position[1]
        Game.SaveConfig('AutoUse/config.conf', Config)
    })
    Game.GetConfig('AutoUse/config.conf', function (a) {

        Config = a
        Game.Panels.ItemsPanel.style.position = Config.MainPanel.x + ' ' + Config.MainPanel.y + ' 0'
    });
    it =Game.GetInventory(Items)
    for (i = 0; i < it; i++) {
        var hasItem = Entities.HasItemInInventory(User, i)
        var name = Abilities.GetAbilityName(hasItem)
        var Item = $.CreatePanel('Panel', Game.Panels.ItemsPanel, 'ItemsPanel')
        Item.BLoadLayoutFromString('<root><script>function Add(){$.GetContextPanel().style.opacity="0.1";$.GetContextPanel().SetPanelEvent("onactivate", Rem)}function Rem(){$.GetContextPanel().style.opacity="1.0";$.GetContextPanel().SetPanelEvent("onactivate", Add)}</script><Panel style="border: 1px solid #000; border-radius: 10px;" onactivate="Rem()"><DOTAAbilityImage style="width:35px;"/></Panel></root>', false, false)
        Item.style.opacity = 0.1
        Item.Children()[0].abilityname = name
    }
}
*/
var AutoUseCheck = function () {
    if (!AutoUse.checked) {
        try {
            Game.Panels.ItemsPanel.DeleteAsync(0)
        } catch (e) { }
        Game.ScriptLogMsg('Script disabled: AutoUse', '#ff0000')
        return
    }
    //циклически замкнутый таймер с проверкой условия с интервалом 'interval'
    function Func() { $.Schedule(interval, function () {
            AutoUseF()
            if (AutoUse.checked)
                Func()
    })
    }
    //Панель с прдметами
    //ItemsPanel()
    //Команды для отключения
    Toggler()
    Func()
    Game.ScriptLogMsg('Script enabled: AutoUse', '#00ff00')
    GameEvents.SendEventClientSide('antiaddiction_toast', { "message": "Автор: LalkaKaro4 \nИнформация: АвтоФайзы + АвтоСтики + АвтоБотл + АвтоУрна(на себя) + Мека + Грейвсы", "duration": "5" })
}


//шаблонное добавление чекбокса в панель
var Temp = $.CreatePanel("Panel", $('#scripts'), "AutoUse")
Temp.SetPanelEvent('onactivate', AutoUseCheck)
Temp.BLoadLayoutFromString('<root><styles><include src="s2r://panorama/styles/dotastyles.vcss_c" /><include src="s2r://panorama/styles/magadan.vcss_c" /></styles><Panel><ToggleButton class="CheckBox" id="AutoUse" text="AutoUse"/></Panel></root>', false, false)
var AutoUse = $.GetContextPanel().FindChildTraverse('AutoUse').Children()[0]