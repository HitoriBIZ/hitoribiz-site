package com.olive.windbrasstuner

import android.Manifest
import android.content.pm.PackageManager
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.olive.windbrasstuner.audio.PitchDetector
import com.olive.windbrasstuner.model.Transposition
import com.olive.windbrasstuner.model.TunerNote
import com.olive.windbrasstuner.model.TuningModel
import java.util.Locale
import kotlin.math.abs

class MainActivity : ComponentActivity() {
    private val detector = PitchDetector()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { WindBrassTunerApp(detector) }
    }

    override fun onStop() {
        detector.stop()
        super.onStop()
    }
}

private val AppBackground = Color(0xFFF2F5FA)
private val PanelBackground = Color.White
private val TunerBlue = Color(0xFF2766D1)
private val FlatBlue = Color(0xFF2878C7)
private val InTuneGreen = Color(0xFF238C4D)
private val SharpOrange = Color(0xFFD66B1E)

@Composable
private fun WindBrassTunerApp(detector: PitchDetector) {
    MaterialTheme(colorScheme = lightColorScheme(primary = TunerBlue, background = AppBackground)) {
        Surface(Modifier.fillMaxSize(), color = AppBackground) {
            TunerScreen(detector)
        }
    }
}

@Composable
private fun TunerScreen(detector: PitchDetector) {
    val context = LocalContext.current
    val model = remember { TuningModel() }
    val detectorState by detector.state.collectAsStateWithLifecycle()
    var modelRevision by remember { mutableIntStateOf(0) }
    var permissionDenied by remember { mutableStateOf(false) }

    val permissionLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission(),
    ) { granted ->
        permissionDenied = !granted
        if (granted) detector.start(model.concertTarget.frequency)
    }

    LaunchedEffect(detectorState.detectedFrequency) {
        model.updateDetectedFrequency(detectorState.detectedFrequency)
        modelRevision++
    }
    modelRevision // Read to make model changes observable to Compose.

    DisposableEffect(Unit) { onDispose { detector.stop() } }

    Column(
        Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 16.dp, vertical = 20.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        Text(
            "Wind Brass Tuner",
            fontSize = 28.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF151A24),
        )

        StatusPanel(model, detectorState.statusMessage, detectorState.isRunning)

        if (permissionDenied) {
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFFFFEBD8)),
                shape = RoundedCornerShape(14.dp),
            ) {
                Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Text("Microphone access is required", fontWeight = FontWeight.Bold)
                    Text(
                        "Open Android Settings and allow microphone access for Wind Brass Tuner, then return and tap Start again.",
                        color = Color(0xFF5E4939),
                    )
                }
            }
        }

        Button(
            onClick = {
                if (detectorState.isRunning) {
                    detector.stop()
                } else if (ContextCompat.checkSelfPermission(context, Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED) {
                    permissionDenied = false
                    detector.start(model.concertTarget.frequency)
                } else {
                    permissionLauncher.launch(Manifest.permission.RECORD_AUDIO)
                }
            },
            modifier = Modifier.fillMaxWidth().height(56.dp),
            colors = ButtonDefaults.buttonColors(
                containerColor = if (detectorState.isRunning) Color(0xFFC83B35) else TunerBlue,
            ),
            shape = RoundedCornerShape(14.dp),
        ) {
            Text(if (detectorState.isRunning) "■  Stop" else "▶  Start", fontSize = 19.sp, fontWeight = FontWeight.Bold)
        }

        ControlsPanel(
            model = model,
            onChanged = {
                model.updateDetectedFrequency(null)
                modelRevision++
                if (detectorState.isRunning) detector.start(model.concertTarget.frequency)
            },
        )
    }
}

@Composable
private fun StatusPanel(model: TuningModel, status: String, running: Boolean) {
    val cents = model.cents
    Card(
        colors = CardDefaults.cardColors(containerColor = PanelBackground),
        shape = RoundedCornerShape(18.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
    ) {
        Column(
            Modifier.fillMaxWidth().padding(22.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(14.dp),
        ) {
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                Text(status, fontWeight = FontWeight.SemiBold, color = if (running) InTuneGreen else Color.Gray)
                Text(model.transposition.shortName, fontWeight = FontWeight.SemiBold, color = Color.Gray)
            }

            Text(model.concertTarget.label, fontSize = 58.sp, fontWeight = FontWeight.Bold)
            Text(
                "Concert target  ${format2(model.concertTarget.frequency)} Hz",
                fontWeight = FontWeight.SemiBold,
                color = Color.Gray,
            )
            Spacer(Modifier.height(2.dp))
            Text(
                model.detectedFrequency?.let { "${format2(it)} Hz" } ?: if (running) "Listening..." else "-- Hz",
                fontSize = 31.sp,
                fontWeight = FontWeight.SemiBold,
                color = if (model.detectedFrequency == null) Color.Gray else Color(0xFF151A24),
            )
            Text(
                centsValue(cents, running),
                fontSize = 46.sp,
                fontWeight = FontWeight.Bold,
                color = centsColor(cents),
            )
            Text(
                centsDirection(cents, running),
                fontSize = 19.sp,
                fontWeight = FontWeight.SemiBold,
                color = centsColor(cents),
            )
            if (model.isStableTone) {
                Text(
                    "✓  Stable tone",
                    modifier = Modifier.background(Color(0xFFE1F4E8), RoundedCornerShape(30.dp)).padding(horizontal = 12.dp, vertical = 6.dp),
                    color = InTuneGreen,
                    fontWeight = FontWeight.Bold,
                )
            }
            TuningMeter(cents)
        }
    }
}

@Composable
private fun TuningMeter(cents: Double?) {
    val ticks = listOf(-50f, -25f, -10f, -5f, 0f, 5f, 10f, 25f, 50f)
    Column(Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
        Canvas(Modifier.fillMaxWidth().height(42.dp)) {
            val center = size.width / 2f
            val y = 16.dp.toPx()
            drawLine(FlatBlue, Offset(0f, y), Offset(center, y), 10.dp.toPx(), StrokeCap.Round)
            drawLine(SharpOrange, Offset(center, y), Offset(size.width, y), 10.dp.toPx(), StrokeCap.Round)
            ticks.forEach { tick ->
                val x = center + center * (tick / 50f)
                val height = if (tick == 0f || abs(tick) == 50f) 30.dp.toPx() else if (abs(tick) == 25f) 22.dp.toPx() else 14.dp.toPx()
                drawLine(Color(0x66505050), Offset(x, y - height / 2), Offset(x, y + height / 2), if (tick == 0f) 2.dp.toPx() else 1.dp.toPx())
            }
            val position = (cents ?: 0.0).coerceIn(-50.0, 50.0).toFloat() / 50f
            drawCircle(centsColor(cents), 11.dp.toPx(), Offset(center + center * position, y))
        }
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            listOf("-50", "-25", "0", "+25", "+50").forEach { Text(it, fontSize = 11.sp, color = Color.Gray) }
        }
    }
}

@Composable
private fun ControlsPanel(model: TuningModel, onChanged: () -> Unit) {
    Card(colors = CardDefaults.cardColors(containerColor = PanelBackground), shape = RoundedCornerShape(16.dp)) {
        Column(Modifier.fillMaxWidth().padding(18.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
            Text("Tuning Setup", fontSize = 19.sp, fontWeight = FontWeight.Bold)
            Selector("Instrument", model.transposition.displayName, Transposition.entries.toList(), { it.displayName }) {
                model.transposition = it
                onChanged()
            }
            Selector("Target Note", model.writtenNote.label, TunerNote.targetNotes, { it.label }) {
                model.writtenNote = it
                onChanged()
            }
            Selector("A4 Reference", "${model.a4Reference.toInt()} Hz", (440..444).map(Int::toDouble), { "${it.toInt()} Hz" }) {
                model.a4Reference = it
                onChanged()
            }
            HorizontalDivider()
            LabelValue("Concert Pitch", model.concertTarget.label)
            LabelValue("Target Frequency", "${format2(model.concertTarget.frequency)} Hz")
        }
    }
}

@Composable
private fun <T> Selector(title: String, value: String, options: List<T>, label: (T) -> String, onSelect: (T) -> Unit) {
    var expanded by remember { mutableStateOf(false) }
    Box {
        Button(
            onClick = { expanded = true },
            modifier = Modifier.fillMaxWidth(),
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFF4F7FC), contentColor = Color(0xFF1A2230)),
            shape = RoundedCornerShape(12.dp),
        ) {
            Column(Modifier.weight(1f), horizontalAlignment = Alignment.Start) {
                Text(title, fontSize = 13.sp, color = Color.Gray, fontWeight = FontWeight.SemiBold)
                Text(value, fontWeight = FontWeight.SemiBold)
            }
            Text("⌄", fontSize = 20.sp)
        }
        DropdownMenu(expanded = expanded, onDismissRequest = { expanded = false }) {
            options.forEach { option ->
                DropdownMenuItem(text = { Text(label(option)) }, onClick = {
                    expanded = false
                    onSelect(option)
                })
            }
        }
    }
}

@Composable
private fun LabelValue(label: String, value: String) {
    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
        Text(label, color = Color.Gray)
        Text(value, fontWeight = FontWeight.SemiBold, textAlign = TextAlign.End)
    }
}

private fun format2(value: Double) = String.format(Locale.US, "%.2f", value)
private fun centsValue(cents: Double?, running: Boolean) = when {
    cents == null -> if (running) "--" else "0.0"
    abs(cents) < 3 -> "0.0"
    else -> String.format(Locale.US, "%+.1f cents", cents)
}
private fun centsDirection(cents: Double?, running: Boolean) = when {
    cents == null -> if (running) "Waiting for a steady tone" else "Ready to tune"
    abs(cents) < 3 -> "In Tune"
    cents > 0 -> "Sharp"
    else -> "Flat"
}
private fun centsColor(cents: Double?) = when {
    cents == null -> Color.Gray
    abs(cents) < 3 -> InTuneGreen
    cents > 0 -> SharpOrange
    else -> FlatBlue
}
