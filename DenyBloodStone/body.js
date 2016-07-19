/*-------------------------------------------------
///////////////////////////////////////////////////
јвто‘айзы, јвтоЅотл, јвто—тики, јвтоћека, јвто”рна
јвтор: vk.com/lalka_karo4
///////////////////////////////////////////////////
-----------------------End-----------------------*/

var interval = 0.1

function DenyBloodStoneF() {

    var User = Players.GetPlayerHeroEntityIndex(Game.GetLocalPlayerID())
    var BloodStone = Game.GetAbilityByName(User, 'item_bloodstone')
    var XYZ = Entities.GetAbsOrigin(User)
    var uix = Game.WorldToScreenX(XYZ[0], XYZ[2], (XYZ[2]))
    var uiy = Game.WorldToScreenY(XYZ[0], XYZ[2], (XYZ[2]))

    if (Game.GetAbilityByName(User, 'item_bloodstone') != 1) {
        if (Abilities.IsCooldownReady(BloodStone) && Entities.GetHealthPercent(User) < 5)
            Game.CastPosition(User, BloodStone, XYZ, false)
    }
}

var DenyBloodStoneCheck = function () {
    if (!DenyBloodStone.checked) {
        Game.ScriptLogMsg('Script disabled: DenyBloodStone', '#ff0000')
        return
    }

    //циклически замкнутый таймер с проверкой услови€ с интервалом 'interval'
    function Func() {
        $.Schedule(interval, function () {
            DenyBloodStoneF()
            if (DenyBloodStone.checked)
                Func()
        })
    }
    Func()
    Game.ScriptLogMsg('Script enabled: DenyBloodStone', '#00ff00')
    GameEvents.SendEventClientSide('antiaddiction_toast', { "message": "јвтор: LalkaKaro4 - SIP ¬ор! \n»нформаци€: јвтоматический денай бладстоуна при достижении порога 5% HP", "duration": "4" })
}


//Ўаблон дл€ добавление чекбокса
var DenyBloodStone = Game.AddScript(1, "DenyBloodStone", DenyBloodStoneCheck)