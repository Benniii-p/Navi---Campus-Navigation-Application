package com.navi.campus

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.navi.campus.ui.screens.FindRoomScreen
import com.navi.campus.ui.theme.NaviTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            NaviTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    FindRoomScreen()
                }
            }
        }
    }
}
