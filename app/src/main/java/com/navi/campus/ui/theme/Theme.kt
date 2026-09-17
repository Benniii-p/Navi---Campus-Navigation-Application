package com.navi.campus.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val NaviColorScheme = darkColorScheme(
    primary = NaviAccentGreen,
    onPrimary = Color.Black,
    background = NaviBackgroundBottom,
    onBackground = NaviTextPrimary,
    surface = NaviSurface,
    onSurface = NaviTextPrimary,
    surfaceVariant = NaviSurfaceVariant,
    onSurfaceVariant = NaviTextSecondary,
    outline = NaviBorder,
)

@Composable
fun NaviTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit,
) {
    MaterialTheme(
        colorScheme = NaviColorScheme,
        typography = NaviTypography,
        content = content,
    )
}
