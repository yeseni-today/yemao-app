import {Component} from '@angular/core';
import {AlertController, NavController, NavParams, PopoverController} from 'ionic-angular';
import {LoginPage} from "../login/login";
import {SharedService} from "../../../service/share.service";
import {DesignerModulePage} from "../../designer/designer";
import {PopoverPage} from "../../popver/popver";
import {EmployerModulePage} from "../../employer/employer";
import {Util} from "../../../service/util";
import {UsersService} from "../../../service/ajax/users.service";


@Component({
    selector: 'page-register',
    templateUrl: 'register.html',
})
export class RegisterPage {

    //页面切换状态
    state: any = 1;


    isDesigner: boolean = true;

    role: any;

    user: any = {}

    confirmPassword;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public shared: SharedService,
                public popoverCtrl: PopoverController,
                public util: Util,
                public usersServ: UsersService) {
        this.role = navParams.get('role');
        if (this.role == 'designer') {
            this.user.role = '00'
        } else {
            this.user.role = '01'
        }
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad LoginPage');
    }


    next() {

        let util = this.util

        if (this.user.phone == null || this.user.phone == '') {
            util.toast('请输入手机号')
            return
        }
        if (this.user.password == null || this.user.password == '') {
            util.toast('请输入密码')
            return
        }

        if (this.confirmPassword == null || this.confirmPassword == '') {
            util.toast('请确认密码')
            return
        }

        if (this.confirmPassword !== this.user.password) {
            util.toast('两次密码输入不一致')
            return
        }

        this.state = 2;
    }

    register() {

        if (this.user.nickname == null || this.user.nickname == '') {
            this.util.toast('请输入昵称')
            return
        }

        this.util.presentLoading('正在注册...')

        this.usersServ.register(this.user)
            .then(user => {
                this.util.hideLoading()
                this.util.presentLoading('正在登录...')
                this.usersServ.login(user)
                    .then(() => {
                        this.util.hideLoading()
                        this.util.toast('登录成功')
                        this.state = 3
                    })
                    .catch(eror => {
                        this.util.hideLoading()
                        this.util.toast('登录失败')
                        this.navCtrl.push(LoginPage)
                    })
            })
            .catch(error => {
                console.log('注册失败', error)
                this.util.hideLoading()
                this.util.toast('注册失败, 请稍后重试')
            })

        this.state = 3;
    }

    openHome() {
        if (this.role === 'designer') {
            this.navCtrl.setRoot(DesignerModulePage, {})
        } else {
            this.navCtrl.setRoot(EmployerModulePage, {});
        }
    }


    selectAvatar() {
        let popover = this.popoverCtrl.create(PopoverPage);
        popover.present({});
    }


    openLoginPage() {
        this.navCtrl.push(LoginPage);
    }
}