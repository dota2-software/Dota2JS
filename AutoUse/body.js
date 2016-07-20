/*-------------------------------------------------
///////////////////////////////////////////////////
АвтоФайзы, АвтоБотл, АвтоСтики, АвтоМека, АвтоУрна
АвтоМидас
Автор: vk.com/lalka_karo4
///////////////////////////////////////////////////
-----------------------End-----------------------*/

/*
try {
    Game.Panels.ItemsPanel.DeleteAsync(0)
} catch (e) { }
*/

var ent
var interval = 0.1

notItems = false;
phase = true;
stick = true;
bottle = true;
urn = true;
meka = true;
midas = true;

var HasItems = [
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
    'modifier_item_armlet_unholy_strength'
    //бх, рики, вивер, енигма блекхол, бейн ульта, задувка котла, связка шамана, тп фуры, пудж дизмембер, ск эпицентр, цм ульт, варлок 3, 
]

var Buffs = [
    'modifier_item_mekansm_noheal',
    'modifier_fountain_aura_buff',
    'modifier_teleporting'
]


GameEvents.Subscribe('game_newmap', function () {
    Game.AutoUseCreate = true
    Game.AutoUseCreate2 = true
    Game.AutoUseCreate3 = true
    Game.AutoUseCreate4 = true
    Game.AutoUseCreate5 = true
    Game.AutoUseCreate6 = true
})
if (!Game.AutoUseCreate) {
    Game.AutoUseCreate = true
    Game.AddCommand("__PhaseBoots_Toggle", function () { if (phase == true) { phase = false } else { phase = true } }, "", 0)
}
if (!Game.AutoUseCreate2) {
    Game.AutoUseCreate2 = true
    Game.AddCommand("__Stick_Toggle", function () { if (stick == true) { stick = false } else { stick = true } }, '', 0)
}

if (!Game.AutoUseCreate3) {
    Game.AutoUseCreate3 = true
    Game.AddCommand('__Bottle_Toggle', function () { if (bottle == true) { bottle = false } else { bottle = true }}, '', 0)
}
if (!Game.AutoUseCreate4) {
    Game.AutoUseCreate4 = true
    Game.AddCommand('__UrnOfShadows_Toggle', function () { if (urn == true){urn = false}else{urn = true}
    }, '', 0)
}
if (!Game.AutoUseCreate5) {
    Game.AutoUseCreate5 = true
    Game.AddCommand('__MekaAndGreaves_Toggle', function () { if (meka == true){meka = false}else{meka = true}}, '', 0)
}

if (!Game.AutoUseCreate6) {
    Game.AutoUseCreate6 = true
    Game.AddCommand('__HandOfMidas_Toggle', function () { if (midas == true) { midas = false } else { midas = true } }, '', 0)
}


function AutoUseF() {

    var User = Players.GetPlayerHeroEntityIndex(Game.GetLocalPlayerID())
    var Inv = Game.GetInventory(User)
    var UserBuffs = Game.GetBuffsNames(User)

    
    // Получение предметов 
    var Stick = Game.GetAbilityByName(User, 'item_magic_stick')
    var Wand = Game.GetAbilityByName(User, 'item_magic_wand')
    var Phase = Game.GetAbilityByName(User, 'item_phase_boots')
    var Bottle = Game.GetAbilityByName(User, 'item_bottle')
    var Urn = Game.GetAbilityByName(User, 'item_urn_of_shadows')
    var Meka = Game.GetAbilityByName(User, 'item_mekansm')
    var Greaves = Game.GetAbilityByName(User, 'item_guardian_greaves')
    var Midas = Game.GetAbilityByName(User, 'item_hand_of_midas')

    var UrnRange = Abilities.GetCastRange(Urn)
    if (Entities.HasItemInInventory(User, 'item_aether_lens'))
        UrnRange += 200
    var BottleRange = Abilities.GetCastRange(Bottle)
    var MidasRange = Abilities.GetCastRange(Midas)

    if (Entities.IsAlive(User)) {
        var HEnts = Game.PlayersHeroEnts()
        //Поиск героев без иллюзий
        for (i in HEnts) {
            var ent = parseInt(HEnts[i])

            //Если противник, юнит мертв, наш герой в инвизе, то ищем дальше
            if (Entities.IsEnemy(ent))
                continue
            // Получаем ХП юнита
            var HP = Entities.GetHealth(ent)

            var entBuffs = Game.GetBuffsNames(ent)

            var Range = Entities.GetRangeToUnit(User, ent)
            // Если Мека есть в инвентаре
            if ((Game.GetAbilityByName(User, 'item_mekansm') || (Game.GetAbilityByName(User, 'item_guardian_greaves'))) != 1) {
                // Если включена
                if (meka == true)
                    //Если есть бафф ауры меки на герое
                    if (Game.IntersecArrays(entBuffs, ['modifier_item_mekansm_aura'])) {
                        // Если нет кд
                        if (Abilities.IsCooldownReady(Meka) && Abilities.IsOwnersManaEnough(Meka))
                            // Mekansm - если порог 150 хп + герой не в инвизе + Баффы
                            if ((HP <= 150) && !Entities.IsInvisible(User) && !Game.IntersecArrays(entBuffs, Buffs) && !Game.IntersecArrays(UserBuffs, ImportantBuffs))
                                Game.CastNoTarget(User, Meka, false)
                        // Если нет кд
                        if (Abilities.IsCooldownReady(Greaves) && Abilities.IsOwnersManaEnough(Greaves))
                            // Guardian Greaves - если порог 200 хп + герой не в инвизе + Баффы
                            if ((HP <= 150) && !Entities.IsInvisible(User) && !Game.IntersecArrays(entBuffs, Buffs) && !Game.IntersecArrays(UserBuffs, ImportantBuffs))
                                Game.CastNoTarget(User, Greaves, false)
                    }
            }

            // Если Урна есть в инвентаре
            if (Game.GetAbilityByName(User, 'item_urn_of_shadows') != -1) {
                // Если Включена
                if (urn == true) {
                    if (Range < UrnRange)
                        // Если нет кд и есть хоть один заряд
                        if (Abilities.IsCooldownReady(Urn) && (Abilities.GetCurrentCharges(Urn) > 0))
                            // Urn Of Shadows - на себя или собзника если порог 200 хп + герой не в инвизе + Баффы
                            if ((HP <= 200) && !Entities.IsInvisible(User) && !Game.IntersecArrays(UserBuffs, ImportantBuffs) && !Game.IntersecArrays(UserBuffs, ['modifier_fountain_aura_buff']))
                                Game.CastTarget(User, Urn, ent, false)
                }
            }

            // Если Ботл есть в инвентаре
            if (Game.GetAbilityByName(User, 'item_bottle') != 1) {
                // Если Ботл включен
                if (bottle == true) {
                    // Сравниваем с ренджом Ботла
                    if (Range < BottleRange)
                        // Если нет кд
                        if (Abilities.IsCooldownReady(Bottle))
                            // Если хп = фулл хп, нет бафа на реген от ботла + есть бафф от фонтана + нет баффа телепортации
                            if (!(Entities.GetHealth(ent) == Entities.GetMaxHealth(ent)) && !Game.IntersecArrays(entBuffs, ["modifier_bottle_regeneration"]) && Game.IntersecArrays(UserBuffs, ['modifier_fountain_aura_buff']) && !Game.IntersecArrays(UserBuffs, ImportantBuffs))
                                Game.CastTarget(User, Bottle, ent, false)
                }
            }
        }

        // Если Стики есть в инвентаре
        if ((Game.GetAbilityByName(User, 'item_magic_stick') || (Game.GetAbilityByName(User, 'item_magic_wand'))) != -1) {
            // Если включены
            if (stick == true) {
                // Если нет кд и есть хоть один заряд
                if (Abilities.IsCooldownReady(Stick) && (Abilities.GetCurrentCharges(Stick) > 1))
                    // Magick Stick - если порог 150 хп + герой не в инвизе + Баффы
                    if ((Entities.GetHealth(User) <= 150) && !Entities.IsInvisible(User) && !Game.IntersecArrays(UserBuffs, Buffs) && !Game.IntersecArrays(UserBuffs, ImportantBuffs))
                        Game.CastNoTarget(User, Stick, false)
                // Если нет кд и есть хоть один заряд
                if (Abilities.IsCooldownReady(Wand) && (Abilities.GetCurrentCharges(Wand) > 0))
                    // Magick Wand - если порог 100 хп + герой не в инвизе + Баффы
                    if ((Entities.GetHealth(User) <= 100) && !Entities.IsInvisible(User) && !Game.IntersecArrays(UserBuffs, Buffs) && !Game.IntersecArrays(UserBuffs, ImportantBuffs))
                        Game.CastNoTarget(User, Wand, false)
            }
        }

        // Если Файзы есть в инвентаре
        if (Game.GetAbilityByName(User, 'item_phase_boots') != -1) {
            // Если включены
            if (phase == true) {
                // Если нет кд
                if (Abilities.IsCooldownReady(Phase))
                    // Если гейрой не в инвизе и не телепортируется
                    if (!Entities.IsInvisible(User) && !Game.IntersecArrays(UserBuffs, ImportantBuffs) && Entities.IsMoving(User))
                        // Каст предмета
                        Game.CastNoTarget(User, Phase, false)
            }
        }

        // Получение 
        var Lane = Entities.GetAllEntitiesByClassname('npc_dota_creep_lane')
        var Neutral = Entities.GetAllEntitiesByClassname('npc_dota_creep_neutral')
        var Creeps = Neutral.concat(Lane)


        if (Game.GetAbilityByName(User, 'item_hand_of_midas') != 1) {
            // Если включены
            if (midas == true) {
                // Если нет кд
                if (Abilities.IsCooldownReady(Midas)) {
                    for (i in Creeps)
                        if (Entities.IsCreep(Creeps[i]) && !Entities.IsAncient(Creeps[i]) && Entities.IsEnemy(Creeps[i]))
                            //var RangeToCreep = Entities.GetRangeToUnit(User, Creeps[i])
                            if (Entities.IsEntityInRange(User, Creeps[i], 600)) 
                                if (!Entities.IsInvisible(User)){
                                    Game.CastTarget(User, Midas, Creeps[i], false)
                                    GameEvents.SendEventClientSide('antiaddiction_toast', { "message": "Ваш мидас был использован!", "duration": "3" })
                                }
              }
            }
        }
    }
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
        
        Game.ScriptLogMsg('Script disabled: AutoUse', '#ff0000')
        return
    }

    // Проверка на один из предметов, если нет, то возвращаемся
    /*
    for (key in Inv) {
        var Item = Inv[key]
        var ItemName = Abilities.GetAbilityName(Item)
        if (HasItems.indexOf(ItemName) != -1)
            notItems = true
    }
    if (notItems == false) {
        AutoUse.checked = false
        Game.ScriptLogMsg('Not Items', '#ff0000')
        GameEvents.SendEventClientSide('antiaddiction_toast', { "message": "Ни один из предметов не куплен \n\nСкрипт Диактивирован", "duration": "5" })
        return
    }
    */

    //циклически замкнутый таймер с проверкой условия с интервалом 'interval'
    function Func() { $.Schedule(interval, function () {
            AutoUseF()
            if (AutoUse.checked)
                Func()
    })
    }
    //Команды для отключения
    Func()
    Game.ScriptLogMsg('Script enabled: AutoUse v0.4.1', '#00ff00')
    GameEvents.SendEventClientSide('antiaddiction_toast', { "message": "Автор: LalkaKaro4 - SIP Вор!\nИнформация: АвтоФайзы + АвтоСтики + АвтоБотл + АвтоУрна + Мека + Грейвсы + АвтоМидас", "duration": "5" })
}

//Шаблон для добавление чекбокса
var AutoUse = Game.AddScript(1, "AutoUse", AutoUseCheck)